import { BaseInvestmentCosts } from '@/models';

export default class Synthetic {
  playerRole: string = 'Pioneer';

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
}
