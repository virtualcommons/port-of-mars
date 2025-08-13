import _ from "lodash";
import { Command } from "@colyseus/command";
import { LiteGameRoom } from "@port-of-mars/server/rooms/pomlite/multiplayer";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, Player, TreatmentParams, Vote } from "./state";
import { LiteGameStatus, LiteGameBinaryVoteInterpretation } from "@port-of-mars/shared/lite";
import { Role } from "@port-of-mars/shared/types";
import { settings } from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

abstract class Cmd<Payload> extends Command<LiteGameRoom, Payload> {
  get defaultParams() {
    return this.state.defaultParams;
  }
}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends CmdWithoutPayload {
  execute() {
    return [
      new SetTreatmentParamsCmd(),
      new CreateDeckCmd(),
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
    // FIXME: add LAU treatments for prolificInteractive
    // something in treatment entity needs to override drawMin drawMax of LAU cards, probably just a
    // lifeAsUsualCards: number (default: 0) gets set to 6, 12, 18 in treatments yml
    // somehow passed into/referenced by drawEventCardDeck
    const cards = (await litegame.drawEventCardDeck(this.state.type)).map(
      data => new EventCard(data)
    );
    if (this.state.type === "prolificVariable") {
      // prolific variable configuration uses a fixed deck
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
    } else if (this.state.type === "prolificInteractive") {
      const { interactiveStudy } = getServices();
      await interactiveStudy.setProlificParticipantPlayers(
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
    const card = this.state.activeCard;
    if (!card) return;

    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }

    // special cases
    if (card.codeName === "compulsivePhilanthropy") {
      return [new ApplyCompulsivePhilanthropyCmd().setPayload({ card, playerSkipped })];
    } else if (card.codeName === "heroOrPariah") {
      if (this.state.currentVoteStep === 1) {
        return [new ApplyHeroOrPariahStep1Cmd().setPayload({ card, playerSkipped })];
      } else {
        return [new ApplyHeroOrPariahStep2Cmd().setPayload({ card, playerSkipped })];
      }
    } else if (card.requiresVote) {
      // offer cards (requires a vote)
      return [new ApplyOfferCardCmd().setPayload({ card, playerSkipped })];
    } else {
      // standard cards (no vote required)
      return [new ApplyStandardCardCmd().setPayload({ card, playerSkipped })];
    }
  }
}

abstract class BaseCardCmd extends Cmd<{ card: EventCard; playerSkipped: boolean }> {
  protected card!: EventCard;

  protected finishVoting() {
    this.state.votingInProgress = false;
    this.state.currentVoteStep = 1;
    this.state.heroOrPariah = "";
    this.state.eventTimeRemaining = 0;
    this.state.eventTimeTotal = 0;
    this.state.players.forEach(p => (p.vote = undefined));
  }

  protected ensureAllPlayersHaveVotes(defaultBinary?: boolean, defaultRole?: Role) {
    this.state.players.forEach(player => {
      if (!player.vote) {
        player.vote = new Vote({
          binaryVote: defaultBinary,
          roleVote: defaultRole,
          isDefaultTimeoutVote: true,
        });
      }
    });
  }

  protected getOrCreateVote(
    player: Player,
    defaultVote: { binaryVote?: boolean; roleVote?: Role }
  ): Vote {
    if (player.vote) {
      // fill in the missing vote value if there is an existing vote but it's missing the target value
      if (defaultVote.binaryVote !== undefined && player.vote.binaryVote === undefined) {
        player.vote.binaryVote = defaultVote.binaryVote;
      }
      if (defaultVote.roleVote !== undefined && player.vote.roleVote === undefined) {
        player.vote.roleVote = defaultVote.roleVote;
      }
    } else {
      player.vote = new Vote({
        ...defaultVote,
        isDefaultTimeoutVote: true,
      });
    }

    return player.vote;
  }

  protected createDefaultVoteIfNeeded(
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

  protected async persistVoteForPlayer(
    player: Player,
    binaryVoteInterpretation?: LiteGameBinaryVoteInterpretation
  ) {
    const { litegame } = getServices();
    if (player.vote) {
      await litegame.createPlayerVote(
        player,
        this.card.deckCardId,
        this.state.currentVoteStep,
        binaryVoteInterpretation
      );
    }
  }

  protected async applyAndPersistVoteEffect(
    player: Player,
    pointsChange: number,
    resourcesChange: number,
    systemHealthChange: number
  ) {
    const { litegame } = getServices();
    player.points = Math.max(0, player.points + pointsChange);
    player.resources = Math.max(0, player.resources + resourcesChange);
    this.state.systemHealth = Math.max(
      0,
      Math.min(this.defaultParams.systemHealthMax, this.state.systemHealth + systemHealthChange)
    );
    await litegame.createPlayerVoteEffect(
      player.playerId,
      this.card.deckCardId,
      pointsChange,
      resourcesChange,
      systemHealthChange
    );
  }

  protected finishCard() {
    this.card.expired = true;
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
}

export class ApplyOfferCardCmd extends BaseCardCmd {
  /**
   * Apply card effects require a binary vote (accept/reject) from one or all players
   * The system health effect of the card is applied for all players that accept the offer
   */
  async execute({ card, playerSkipped } = this.payload) {
    this.card = card;

    const affectedRole = this.card.affectedRole;
    // all players or affected role player
    const targetPlayers: Player[] = affectedRole
      ? Array.from(this.state.players.values()).filter(p => p.role === affectedRole)
      : Array.from(this.state.players.values());

    if (targetPlayers.length === 0) {
      return this.finishCard();
    }

    for (const player of targetPlayers) {
      // default to rejecting the offer
      const vote = this.getOrCreateVote(player, { binaryVote: false });
      const binaryVote = vote.binaryVote;
      await this.persistVoteForPlayer(
        player,
        binaryVote ? "accept_greedy_offer" : "reject_greedy_offer"
      );

      logger.fatal(`pointsEffect: ${this.card.pointsEffect}`);
      logger.fatal(`resourcesEffect: ${this.card.resourcesEffect}`);
      logger.fatal(`systemHealthEffect: ${this.card.systemHealthEffect}`);
      if (binaryVote === true) {
        await this.applyAndPersistVoteEffect(
          player,
          this.card.pointsEffect,
          this.card.resourcesEffect,
          this.card.systemHealthEffect
        );
      }
    }

    this.finishVoting();
    return this.finishCard();
  }
}

export class ApplyStandardCardCmd extends BaseCardCmd {
  /**
   * Apply card effects that do not require a vote and affects one or all player
   * System health effect is applied once globally
   */
  async execute({ card, playerSkipped } = this.payload) {
    this.card = card;

    const affectedRole = this.card.affectedRole;
    // all players or affected role player
    const targetPlayers: Player[] = affectedRole
      ? Array.from(this.state.players.values()).filter(p => p.role === affectedRole)
      : Array.from(this.state.players.values());

    if (targetPlayers.length === 0) {
      return this.finishCard();
    }

    for (const player of targetPlayers) {
      player.points = Math.max(0, player.points + this.card.pointsEffect);
      player.resources = Math.max(0, player.resources + this.card.resourcesEffect);
    }
    // when the scaling factor is not 1, we need to scale up the system health effect
    // (this is used in prolificBaseline/Variable since we want the system health contributions/effects to
    // appear 'averaged out' to keep the values the same as a solo game)
    const scaledSystemHealthEffect =
      this.card.systemHealthEffect * (this.defaultParams.systemHealthScalingFactor || 1);
    // apply system health changes (always apply the card's effect once, globally)
    this.state.systemHealth = Math.max(
      0,
      Math.min(
        this.defaultParams.systemHealthMax,
        this.state.systemHealth + scaledSystemHealthEffect
      )
    );

    return this.finishCard();
  }
}

export class ApplyCompulsivePhilanthropyCmd extends BaseCardCmd {
  async execute({ card, playerSkipped } = this.payload) {
    this.card = card;

    // get the role votes and find the most voted role
    const roleVotes: { [role: string]: number } = {};
    this.state.players.forEach(player => {
      if (player.vote?.roleVote) {
        const role = player.vote.roleVote;
        roleVotes[role] = (roleVotes[role] || 0) + 1;
      }
    });

    // find the role with the most votes (simple majority, or first in case of tie)
    let selectedRole: Role | null = null;
    let maxVotes = 0;

    for (const [role, votes] of Object.entries(roleVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        selectedRole = role as Role;
      }
    }

    if (selectedRole) {
      // find the player with the selected role and make them invest all resources
      const targetPlayer = Array.from(this.state.players.values()).find(
        p => p.role === selectedRole
      );

      if (targetPlayer && targetPlayer.resources > 0) {
        const resourcesInvested = targetPlayer.resources;

        // move all resources to system health
        this.state.systemHealth = Math.min(
          this.defaultParams.systemHealthMax,
          this.state.systemHealth + resourcesInvested
        );
        targetPlayer.resources = 0;

        // persist the voting effects
        const { litegame } = getServices();
        for (const voter of this.state.players.values()) {
          if (voter.vote) {
            await litegame.createPlayerVote(
              voter,
              this.card.deckCardId,
              this.state.currentVoteStep
            );

            // create vote effect for the target player only
            if (voter.playerId === targetPlayer.playerId) {
              await litegame.createPlayerVoteEffect(
                voter.playerId,
                this.card.deckCardId,
                0, // points change
                -resourcesInvested, // resources change (negative because resources were removed)
                resourcesInvested // system health change
              );
            }
          }
        }
      }
    }

    this.finishVoting();
    return this.finishCard();
  }
}

export class ApplyHeroOrPariahStep1Cmd extends BaseCardCmd {
  async execute({ card, playerSkipped } = this.payload) {
    this.card = card;

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

    return; // don't finish the card yet, wait for step 2
  }
}

export class ApplyHeroOrPariahStep2Cmd extends BaseCardCmd {
  async execute({ card, playerSkipped } = this.payload) {
    this.card = card;

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

    this.finishVoting();
    return this.finishCard();
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
    // initialize and start the event timer
    let eventTimeout = this.defaultParams.eventTimeout;
    if (this.state.activeCard?.requiresVote) eventTimeout *= 2;
    this.state.eventTimeTotal = eventTimeout;
    this.state.eventTimeRemaining = eventTimeout;
    this.room.eventTimeout = this.clock.setTimeout(() => {
      this.room.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    }, eventTimeout * 1000);
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
  player: Player;
  binaryVote?: boolean;
  roleVote?: Role;
}> {
  validate() {
    return this.state.votingInProgress && this.state.activeCardId >= 0;
  }

  execute() {
    const { player, binaryVote, roleVote } = this.payload;

    player.vote = new Vote({
      binaryVote,
      roleVote,
      isDefaultTimeoutVote: false,
    });

    const requiredVoters = this.getRequiredVoters();
    const allVoted = requiredVoters.every(p => p.vote !== undefined);

    if (allVoted) {
      this.room.eventTimeout?.clear();
      return [new ApplyCardCmd().setPayload({ playerSkipped: false })];
    }
  }

  private getRequiredVoters(): Player[] {
    const activeCard = this.state.activeCard;
    if (activeCard?.affectedRole) {
      const affectedPlayer = this.state.getPlayerByRole(activeCard.affectedRole);
      return affectedPlayer ? [affectedPlayer] : [];
    }
    return Array.from(this.state.players.values());
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
