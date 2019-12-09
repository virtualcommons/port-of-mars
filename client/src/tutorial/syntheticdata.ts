import {
  BaseInvestmentCosts, GetAccomplishmentsByPerson, GetEventsForTheRound, RawGameEvent,
} from '@/models';

export default class Synthetic {
  playerRole: string = 'Researcher';

  roundNumber: number = 0;

  baseRoundCosts = BaseInvestmentCosts[this.playerRole];

  private roundArray!:RawGameEvent[];

  getNewEvents() {
    this.roundArray = GetEventsForTheRound();
  }

  get player() {
    return this.playerRole;
  }

  get round() {
    return this.roundNumber;
  }

  get roundCosts() {
    return this.baseRoundCosts;
  }

  // get activeAccomplishments() {
  //   return GetAccomplishmentsByPerson(this.role, 3);
  // }

  get eventsThisRound() {
    this.getNewEvents();
    return this.roundArray;
  }
}
