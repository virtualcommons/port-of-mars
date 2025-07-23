import _ from "lodash";
import { Command } from "@colyseus/command";
import { LiteGameRoom } from "@port-of-mars/server/rooms/pomlite/multiplayer";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, Player, TreatmentParams, Vote } from "./state";
import { LiteGameStatus, LiteGameBinaryVoteInterpretation } from "@port-of-mars/shared/lite";
import { Role } from "@port-of-mars/shared/types";

abstract class Cmd<Payload> extends Command<LiteGameRoom, Payload> {
  get defaultParams() {
    return this.state.defaultParams;
  }
}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends CmdWithoutPayload {
  execute() {
    return [
      new CreateDeckCmd(),
      new SetTreatmentParamsCmd(),
      new SetGameParamsCmd(),
      new PersistGameCmd(),
      new WaitForPlayersCmd(),
      new StartGameLoopCmd(),
    ];
  }
}

export class StartGameLoopCmd extends CmdWithoutPayload {
  execute() {
    this.room.startGameLoop();
  }
}

export class CreateDeckCmd extends CmdWithoutPayload {
  async execute() {
    const { litegame } = getServices();
    const cards = (await litegame.drawEventCardDeck(this.state.type)).map(
      data => new EventCard(data)
    );
    if (this.state.type === "prolificVariable") {
      // prolific configuration uses a fixed deck
      this.state.eventCardDeck.push(...cards);
    } else {
      const shuffledCards = _.shuffle(cards);
      this.state.eventCardDeck.push(...shuffledCards);
    }
  }
}

export class SetTreatmentParamsCmd extends CmdWithoutPayload {
  async execute() {
    this.state.treatmentParams = new TreatmentParams(
      await getServices().litegame.getRandomTreatmentFor(this.state.type)
    );
  }
}

export class SetGameParamsCmd extends CmdWithoutPayload {
  execute() {
    const defaults = this.defaultParams;
    this.state.maxRound = getRandomIntInclusive(defaults.maxRound.min, defaults.maxRound.max);
    this.state.twoEventsThreshold = getRandomIntInclusive(
      defaults.twoEventsThreshold.min,
      defaults.twoEventsThreshold.max
    );
    // this formula may need tweaking
    const threeEventsThresholdMax = Math.min(
      defaults.threeEventsThreshold.max,
      this.state.twoEventsThreshold - 3
    );
    this.state.threeEventsThreshold = getRandomIntInclusive(
      defaults.threeEventsThreshold.min,
      threeEventsThresholdMax
    );
    this.state.chatEnabled = defaults.chatEnabled || false;
    this.state.updateVisibleCards();
  }
}

export class PersistGameCmd extends CmdWithoutPayload {
  async execute() {
    const { litegame, multiplayerStudy } = getServices();
    const game = await litegame.createGame(this.state);
    if (["prolificVariable", "prolificBaseline"].includes(this.state.type)) {
      await multiplayerStudy.setProlificParticipantPlayers(
        this.state.type,
        game.players,
        this.room.roomId
      );
    }
    this.state.gameId = game.id;
  }
}

export class SetFirstRoundCmd extends CmdWithoutPayload {
  execute() {
    const defaults = this.defaultParams;
    this.state.round = 1;
    this.state.systemHealth = defaults.startingSystemHealth;
    this.state.timeRemaining = defaults.timeRemaining;
    this.state.players.forEach(player => {
      player.resources = defaults.resources;
    });
    this.state.updateRoundInitialValues();
    this.state.isRoundTransitioning = false;
    this.state.canInvest = true;
    this.state.isRoundInitialized = true;

    return [new SendHiddenParamsCmd()];
  }
}

export class WaitForPlayersCmd extends CmdWithoutPayload {
  execute() {
    this.state.isWaitingToStart = true;
    this.state.timeRemaining = 120;
    this.state.players.forEach(p => (p.isReadyToStart = false));
  }
}

export class SendHiddenParamsCmd extends CmdWithoutPayload {
  execute() {
    const data = this.state.buildHiddenParams();
    this.room.clients.forEach(client => {
      client.send("set-hidden-params", {
        kind: "set-hidden-params",
        data,
      });
    });
  }
}

export class ApplyCardCmd extends Cmd<{ playerSkipped: boolean }> {
  validate() {
    return (
      this.state.activeCardId >= 0 &&
      this.state.status === "incomplete" &&
      this.state.systemHealth > 0
    );
  }

  async execute({ playerSkipped } = this.payload) {
    if (!this.state.activeCard) return;

    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }

    // apply card effects based on whether it requires voting
    if (this.state.activeCard.requiresVote) {
      return this.applyVotingEffects();
    } else {
      return this.applyStandardEffects();
    }
  }

  private applyStandardEffects() {
    if (!this.state.activeCard) return;

    this.state.players.forEach(player => {
      if (this.state.activeCard) {
        if (player.points < -this.state.activeCard.pointsEffect) {
          player.points = 0;
        } else {
          player.points += this.state.activeCard.pointsEffect;
        }

        if (player.resources < -this.state.activeCard.resourcesEffect) {
          player.resources = 0;
        } else {
          player.resources += this.state.activeCard.resourcesEffect;
        }
      }
    });

    // scale system health effect by number of players
    const scaledSystemHealthEffect =
      this.state.numPlayers * this.state.activeCard.systemHealthEffect;

    this.state.systemHealth = Math.max(
      0,
      Math.min(
        this.defaultParams.systemHealthMax,
        this.state.systemHealth + scaledSystemHealthEffect
      )
    );

    return this.finishCard();
  }

  private finishCard() {
    if (!this.state.activeCard) return;

    this.state.activeCard.expired = true;
    this.state.updateVisibleCards();

    if (this.state.systemHealth <= 0) {
      this.state.players.forEach(player => {
        (player.pendingInvestment = 0), (player.pointsEarned = 0);
      });
      return [new PersistRoundCmd(), new EndGameCmd().setPayload({ status: "defeat" })];
    }

    // move to next card or investment phase
    const nextRoundCard = this.state.nextRoundCard;
    if (nextRoundCard) {
      this.state.activeCardId = nextRoundCard.deckCardId;
      return new StartEventTimerCmd();
    } else {
      this.state.canInvest = true;
      this.state.activeCardId = -1;
    }
  }

  private async applyVotingEffects() {
    if (!this.state.activeCard) return;

    if (this.state.activeCard.codeName === "personalGain") {
      await this.applyPersonalGainEffects();
    } else if (this.state.activeCard.codeName === "heroOrPariah") {
      const shouldContinue = await this.applyHeroOrPariahEffects();
      if (!shouldContinue) {
        return; // don't clear voting state yet, continue to next step
      }
    }

    // clear voting state and continue to next card
    this.state.votingInProgress = false;
    this.state.players.forEach(player => {
      player.vote = undefined;
    });

    return this.finishCard();
  }

  private createDefaultVoteIfNeeded(
    player: Player,
    vote: { binaryVote?: boolean; roleVote?: Role }
  ) {
    if (vote.roleVote && vote.binaryVote) {
      throw new Error("Cannot set both roleVote and binaryVote");
    }

    // create vote if player has none
    if (!player.vote) {
      player.vote = new Vote({
        ...vote,
        isDefaultTimeoutVote: true,
      });
      return;
    }

    // fill in the missing vote value if there is an existing vote but it's missing the target value
    if (vote.binaryVote !== undefined && player.vote.binaryVote === undefined) {
      player.vote.binaryVote = vote.binaryVote;
      player.vote.isDefaultTimeoutVote = true;
    }

    if (vote.roleVote !== undefined && player.vote.roleVote === undefined) {
      player.vote.roleVote = vote.roleVote;
      player.vote.isDefaultTimeoutVote = true;
    }
  }

  private async persistVoteForPlayer(
    player: Player,
    binaryVoteInterpretation?: LiteGameBinaryVoteInterpretation
  ) {
    const { litegame } = getServices();
    if (player.vote) {
      await litegame.createPlayerVote(
        player,
        this.state.activeCardId,
        this.state.currentVoteStep,
        binaryVoteInterpretation
      );
    }
  }

  private async applyAndPersistVoteEffect(
    player: Player,
    pointsChange: number,
    resourcesChange: number,
    systemHealthChange: number
  ) {
    const { litegame } = getServices();
    player.points += pointsChange;
    player.resources += resourcesChange;
    this.state.systemHealth = Math.max(0, this.state.systemHealth - systemHealthChange);
    await litegame.createPlayerVoteEffect(
      player.playerId,
      this.state.activeCardId,
      pointsChange,
      resourcesChange,
      systemHealthChange
    );
  }

  private async applyPersonalGainEffects() {
    for (const player of this.state.players.values()) {
      // if they don't have a binary vote, create a default one
      this.createDefaultVoteIfNeeded(player, { binaryVote: false });
      const interpretation: LiteGameBinaryVoteInterpretation = player.vote!.binaryVote
        ? "accept_greedy_offer"
        : "reject_greedy_offer";
      await this.persistVoteForPlayer(player, interpretation);

      const binaryVote = player.vote!.binaryVote;

      const pointsChange = 0;
      let resourcesChange = 0;
      let systemHealthChange = 0;

      if (binaryVote === true) {
        // player chose "yes" - gains 6 resources, loses 6 system health
        resourcesChange = 6;
        systemHealthChange = -6;
      }
      await this.applyAndPersistVoteEffect(
        player,
        pointsChange,
        resourcesChange,
        systemHealthChange
      );
    }
  }

  private async applyHeroOrPariahEffects(): Promise<boolean> {
    if (this.state.currentVoteStep === 1) {
      return await this.applyHeroOrPariahStep1();
    } else if (this.state.currentVoteStep === 2) {
      return await this.applyHeroOrPariahStep2();
    }
    return true; // unreachable
  }

  private async applyHeroOrPariahStep1(): Promise<boolean> {
    // ensure all players have votes for step 1 (blank defaults for non-voters)
    for (const player of this.state.players.values()) {
      this.createDefaultVoteIfNeeded(player, {});
    }

    for (const player of this.state.players.values()) {
      if (player.vote!.binaryVote !== undefined) {
        const interpretation: LiteGameBinaryVoteInterpretation = player.vote!.binaryVote
          ? "chose_hero"
          : "chose_pariah";
        await this.persistVoteForPlayer(player, interpretation);
      } else {
        // blank vote no interpretation needed
        await this.persistVoteForPlayer(player);
      }
    }

    // count only actual votes
    let pariahVotes = 0;
    let heroVotes = 0;

    for (const player of this.state.players.values()) {
      if (player.vote!.binaryVote === true) {
        heroVotes++;
      } else if (player.vote!.binaryVote === false) {
        pariahVotes++;
      }
    }

    // store the decision for step 2, default to "hero" if no votes or tie
    let shouldGainResources = true; // default to hero
    if (heroVotes !== pariahVotes) {
      shouldGainResources = heroVotes > pariahVotes;
    }
    this.state.heroOrPariah = shouldGainResources ? "hero" : "pariah";

    // clear votes and move to step 2
    this.state.players.forEach(player => {
      player.vote = undefined;
    });
    this.state.currentVoteStep = 2;
    // start new timer for step 2
    this.room.eventTimeout = this.clock.setTimeout(() => {
      this.room.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    }, this.defaultParams.eventTimeout * 1000);

    return false; // don't finish the card yet
  }

  private async applyHeroOrPariahStep2(): Promise<boolean> {
    const shouldGainResources = this.state.heroOrPariah === "hero";
    // ensure all players have votes for step 2
    for (const player of this.state.players.values()) {
      this.createDefaultVoteIfNeeded(player, {});
    }
    for (const player of this.state.players.values()) {
      await this.persistVoteForPlayer(player);
    }

    // count only actual role votes
    const availableRoles: Role[] = Array.from(this.state.players.values()).map(p => p.role);
    const roleVoteCounts: Record<Role, number> = {} as Record<Role, number>;
    availableRoles.forEach(role => {
      roleVoteCounts[role] = 0;
    });
    for (const player of this.state.players.values()) {
      if (player.vote!.roleVote !== undefined) {
        roleVoteCounts[player.vote!.roleVote]++;
      }
    }

    // find the role with the most votes, or random role if no votes/tie
    let targetRole: Role = availableRoles[Math.floor(Math.random() * availableRoles.length)];
    let maxVotes = 0;
    let tiedRoles: Role[] = [];

    for (const [role, votes] of Object.entries(roleVoteCounts)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        targetRole = role as Role;
        tiedRoles = [role as Role];
      } else if (votes === maxVotes && votes > 0) {
        tiedRoles.push(role as Role);
      }
    }

    // if there's a tie among actual votes, pick randomly from tied roles
    if (tiedRoles.length > 1) {
      targetRole = tiedRoles[Math.floor(Math.random() * tiedRoles.length)];
    }

    // apply the effect to the target player
    const targetPlayer = Array.from(this.state.players.values()).find(p => p.role === targetRole);
    if (targetPlayer) {
      const pointsChange = 0;
      let resourcesChange = 0;
      const systemHealthChange = 0;

      if (shouldGainResources) {
        resourcesChange = 4;
      } else {
        resourcesChange = -targetPlayer.resources;
      }

      await this.applyAndPersistVoteEffect(
        targetPlayer,
        pointsChange,
        resourcesChange,
        systemHealthChange
      );
    }

    // reset vote step and clean up
    this.state.currentVoteStep = 1;
    this.state.heroOrPariah = "";

    return true; // now allow finishing the card
  }
}

export class StartEventTimerCmd extends CmdWithoutPayload {
  execute() {
    // check if the active card requires voting
    if (this.state.activeCard?.requiresVote) {
      this.state.votingInProgress = true;
      this.state.currentVoteStep = 1;
      this.state.heroOrPariah = "";
    }

    // start the event timer
    this.room.eventTimeout = this.clock.setTimeout(() => {
      this.room.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    }, this.defaultParams.eventTimeout * 1000);
  }
}

export class DrawCardsCmd extends CmdWithoutPayload {
  execute() {
    let drawCount = this.getDrawCount();
    this.drawRoundCards(drawCount);
    // draw 2 more if murphy's law is in play
    if (this.state.roundEventCards.some(card => card.isMurphysLaw)) {
      drawCount += 2;
      this.drawRoundCards(2);
    }
    this.state.timeRemaining += this.defaultParams.eventTimeout * drawCount;
    const nextRoundCard = this.state.nextRoundCard;
    if (nextRoundCard) {
      this.state.activeCardId = nextRoundCard.deckCardId;
    } else {
      this.state.activeCardId = -1;
    }
    this.state.updateVisibleCards();
    return new StartEventTimerCmd();
  }

  drawRoundCards(count: number) {
    let drawn = 0;
    for (const card of this.state.upcomingEventCards) {
      if (drawn === count) {
        break;
      }
      card.inPlay = true;
      drawn++;
    }
  }

  getDrawCount() {
    if (this.state.systemHealth >= this.state.twoEventsThreshold) return 1;
    if (this.state.systemHealth >= this.state.threeEventsThreshold) return 2;
    return 3;
  }
}

export class PlayerInvestCmd extends Cmd<{
  systemHealthInvestment: number;
  clockRanOut?: boolean;
  player: Player;
}> {
  validate({ systemHealthInvestment, player } = this.payload) {
    return this.state.canInvest && systemHealthInvestment <= player.resources;
  }
  async execute({ systemHealthInvestment, clockRanOut, player } = this.payload) {
    player.hasInvested = !clockRanOut;
    player.pendingInvestment = systemHealthInvestment;
    // check if all players have a pending investment, if so, process the round
    if (Array.from(this.state.players.values()).every(p => p.pendingInvestment >= 0)) {
      this.state.canInvest = false;
      return [new ProcessRoundCmd()];
    }
  }
}

export class ProcessVoteCmd extends Cmd<{
  playerId: number;
  binaryVote?: boolean;
  roleVote?: Role;
}> {
  validate() {
    return this.state.votingInProgress && this.state.activeCardId >= 0;
  }

  execute() {
    const { playerId, binaryVote, roleVote } = this.payload;

    const player = this.state.players.get(playerId.toString());
    if (!player) return;

    player.vote = new Vote({
      binaryVote,
      roleVote,
      isDefaultTimeoutVote: false,
    });
  }
}

export class ProcessRoundCmd extends CmdWithoutPayload {
  async execute() {
    let totalSystemHealthInvestment = 0;
    this.state.players.forEach(player => {
      if (player.pendingInvestment >= 0) {
        // if the investment was caused by a timeout, the player invests nothing
        // and gets no points
        let surplus = 0;
        if (player.hasInvested) {
          surplus = player.resources - player.pendingInvestment;
        }
        totalSystemHealthInvestment += player.pendingInvestment;
        player.points += surplus;
        player.pointsEarned = surplus;
      }
    });
    this.state.systemHealth = Math.min(
      this.defaultParams.systemHealthMax,
      this.state.systemHealth + totalSystemHealthInvestment
    );

    // wait a bit for the round transition so we can see the investment before deducting wear+tear
    this.state.timeRemaining = this.defaultParams.roundTransitionDuration;
    this.state.isRoundTransitioning = true;
    this.state.canInvest = false;
    await new Promise(resolve =>
      setTimeout(resolve, this.defaultParams.roundTransitionDuration * 1000)
    );
    this.state.systemHealth = Math.max(
      0,
      this.state.systemHealth - this.defaultParams.systemHealthWear
    );

    if (this.state.systemHealth <= 0) {
      return [new PersistRoundCmd(), new EndGameCmd().setPayload({ status: "defeat" })];
    }
    return [new PersistRoundCmd(), new SetNextRoundCmd()];
  }
}

export class PersistRoundCmd extends CmdWithoutPayload {
  async execute() {
    await getServices().litegame.createRound(this.state);
  }
}

export class SetNextRoundCmd extends CmdWithoutPayload {
  async execute() {
    this.state.canInvest = false; // disable investment until all cards are applied
    this.state.players.forEach(player => {
      // reset pending investment
      player.pendingInvestment = -1;
      player.hasInvested = false;
    });
    this.state.isRoundTransitioning = false;

    const defaults = this.defaultParams;

    if (this.state.round + 1 > this.state.maxRound) {
      return new EndGameCmd().setPayload({ status: "victory" });
    }

    this.state.round += 1;
    this.state.updateRoundInitialValues();

    this.state.players.forEach(player => {
      player.resources = defaults.resources;
    });

    this.state.timeRemaining = defaults.timeRemaining;

    this.state.eventCardDeck.forEach(card => {
      card.inPlay = false;
    });
    this.state.updateVisibleCards();
    if (this.state.upcomingEventCards.length > 0) {
      return new DrawCardsCmd();
    } else {
      this.state.canInvest = true;
      this.state.activeCardId = -1;
    }
  }
}

export class EndGameCmd extends Cmd<{ status: LiteGameStatus; abandoned?: boolean }> {
  async execute({ status, abandoned } = this.payload) {
    this.clock.clear();

    if (!abandoned) {
      // wait for a few seconds so the client can see the final state
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    this.state.status = status;
    const players = Array.from(this.state.players.values()).map(player => ({
      userId: player.userId,
      points: player.points,
    }));
    const { litegame } = getServices();
    await litegame.updateGameStatus(this.state.gameId, status);
    await litegame.updatePlayerPoints(this.state.gameId, players, this.state.maxRound, status);

    if (abandoned) {
      this.room.disconnect();
    }

    // wait for the update to be sent to the client
    await new Promise(resolve => setTimeout(resolve, 5000));

    const nextGameType = this.defaultParams.nextGameType;
    if (nextGameType) {
      return new ResetGameStateCmd();
    } else {
      this.room.disconnect();
    }
  }
}

export class ResetGameStateCmd extends CmdWithoutPayload {
  execute() {
    const nextType = this.state.defaultParams.nextGameType;
    if (!nextType) return; // for safety

    this.state.gameId = 0;
    this.state.type = nextType;
    this.state.isWaitingToStart = true;
    this.state.timeRemaining = 90;

    this.state.eventCardDeck.length = 0;
    this.state.visibleEventCards.length = 0;
    this.state.activeCardId = -1;
    this.state.round = 1;
    this.state.status = "incomplete";
    this.state.systemHealth = 0;

    this.state.players.forEach(p => {
      p.resources = 0;
      p.points = 0;
      p.pendingInvestment = -1;
      p.pointsEarned = 0;
      p.hasInvested = false;
      p.isReadyToStart = false;
    });

    return new InitGameCmd();
  }
}
