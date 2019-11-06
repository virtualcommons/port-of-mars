import { BaseInvestmentCosts, GetAccomplishmentsByPerson } from '@/models';

export default class Synthetic {
  playerRole: string = 'Politician';

  roundNumber: number = 0;

  baseRoundCosts = BaseInvestmentCosts[this.playerRole];

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
}
