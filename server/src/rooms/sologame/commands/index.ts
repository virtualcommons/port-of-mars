import _ from "lodash";
import { Command } from "@colyseus/command";
import { User } from "@port-of-mars/server/entity";
import { SoloGameRoom } from "@port-of-mars/server/rooms/sologame";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";

const { sologame: service } = getServices();

abstract class Cmd<Payload> extends Command<SoloGameRoom, Payload> {}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends Cmd<{ user: User }> {
  execute({ user } = this.payload) {
    return [
      new SetPlayerCmd().setPayload({ user }),
      new CreateDeckCmd(),
      new SetTreatmentParamsCmd().setPayload({ user }),
      new SetFirstRoundCmd(),
    ];
  }
}

export class SetPlayerCmd extends Cmd<{ user: User }> {
  execute({ user } = this.payload) {
    this.state.player.assign({
      username: user.username,
      points: 0,
    });
  }
}

export class CreateDeckCmd extends CmdWithoutPayload {
  async execute() {
    const cards = await service.drawEventCardDeck();
    this.state.eventCardDeck.concat(_.shuffle(cards));
  }
}

export class SetTreatmentParamsCmd extends Cmd<{ user: User }> {
  async execute({ user } = this.payload) {
    // pick a random (unseen, if user hasn't been through them all) treatment configuration
    const treatmentIds = await service.getUserRemainingTreatments(user.id);
    if (treatmentIds.length > 0) {
      const treatmentId = treatmentIds[Math.floor(Math.random() * treatmentIds.length)];
      this.state.treatmentParams = await service.getTreatmentById(treatmentId);
    } else {
      this.state.treatmentParams = await service.getRandomTreatment();
    }
  }
}

export class SetFirstRoundCmd extends CmdWithoutPayload {
  execute() {
    // FIXME: pull these from defaults somewhere
    this.state.maxRound = getRandomIntInclusive(6, 14);
    this.state.twoCardThreshold = getRandomIntInclusive(12, 20);
    // this formula may need tweaking
    const threeCardThresholdMax = Math.min(15, this.state.twoCardThreshold - 3);
    this.state.threeCardThreshold = getRandomIntInclusive(5, threeCardThresholdMax);
    this.state.round = 1;
    this.state.systemHealth = 25;
    this.state.timeRemaining = 30;
    this.state.player.resources = 7;
  }
}

export class ApplyCardCmd extends Cmd<{ playerSkipped: boolean }> {
  validate() {
    return (
      this.state.activeRoundCardIndex >= 0 &&
      this.state.activeRoundCardIndex < this.state.roundEventCards.length
    );
  }

  execute({ playerSkipped } = this.payload) {
    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }
    this.state.player.points += this.state.activeRoundCard!.pointsDelta;
    this.state.player.resources += this.state.activeRoundCard!.resourcesDelta;
    this.state.systemHealth += this.state.activeRoundCard!.systemHealthDelta;
    if (this.state.systemHealth <= 0) {
      return new EndGameCmd().setPayload({ status: "defeat" });
    }

    // if we still have cards left, prepare the next one
    if (this.state.activeRoundCardIndex < this.state.roundEventCards.length - 1) {
      this.state.activeRoundCardIndex += 1;
      return new StartEventTimerCmd();
    }
  }
}

export class StartEventTimerCmd extends CmdWithoutPayload {
  execute() {
    this.room.eventTimeout = this.clock.setTimeout(() => {
      return new ApplyCardCmd().setPayload({ playerSkipped: false });
    }, 10 * 1000);
  }
}

export class DrawCardsCmd extends CmdWithoutPayload {
  execute() {
    let drawCount = 1;
    if (this.state.systemHealth > this.state.twoCardThreshold) {
      drawCount = 1;
    } else if (this.state.systemHealth > this.state.threeCardThreshold) {
      drawCount = 2;
    } else {
      drawCount = 3;
    }
    this.state.roundEventCards.concat(this.state.eventCardDeck.splice(0, drawCount));
    // draw 2 more if murphy's law is in play
    if (this.state.roundEventCards.some(card => card.isMurphysLaw)) {
      this.state.roundEventCards.concat(this.state.eventCardDeck.splice(0, 2));
    }
    this.state.timeRemaining += 10 * drawCount;
    this.state.activeRoundCardIndex = 0;
    return new StartEventTimerCmd();
  }
}

export class InvestCmd extends Cmd<{
  systemHealthInvestment: number;
  pointsInvestment: number;
}> {
  validate({ systemHealthInvestment, pointsInvestment } = this.payload) {
    return this.state.resources === systemHealthInvestment + pointsInvestment;
  }

  execute({ systemHealthInvestment, pointsInvestment } = this.payload) {
    this.state.systemHealth = Math.min(25, this.state.systemHealth + systemHealthInvestment);
    this.state.player.points += pointsInvestment;
    return new SetNextRoundCmd();
  }
}

export class SetNextRoundCmd extends CmdWithoutPayload {
  execute() {
    // TODO: persist round
    this.state.round += 1;
    if (this.state.round > this.state.maxRound) {
      return new EndGameCmd().setPayload({ status: "victory" });
    }
    if (this.state.systemHealth <= 5) {
      return new EndGameCmd().setPayload({ status: "defeat" });
    }
    this.state.systemHealth -= 5; // pull these from defaults somewhere
    this.state.player.resources = 7;
    this.state.timeRemaining = 30;
  }
}

export class EndGameCmd extends Cmd<{ status: string }> {
  execute({ status } = this.payload) {
    // do any cleanup
    this.state.status = status;
    this.room.disconnect();
  }
}
