import {
  BaseInvestmentCosts, GetAccomplishmentsByPerson, GetEventsForTheRound, RawGameEvent,
} from '@/models';

export default class Synthetic {
  playerRole: string = 'Politician';

  roundNumber: number = 0;

  baseRoundCosts = BaseInvestmentCosts[this.playerRole];

  private roundArray!:RawGameEvent[];

  constructor() {
    this.getNewEvents();
  }

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

  get activeAccomplishments() {
    return GetAccomplishmentsByPerson(this.playerRole);
  }

  get eventsThisRound() {
    return this.roundArray;
  }
}
