import { BaseInvestmentCosts } from '@/models';

export default class Synthetic {
  playerRole: string = 'Researcher';

  roundNumber: number = 0;

  baseRoundCosts = BaseInvestmentCosts[this.playerRole];

  get player() {
    return this.playerRole;
  }

  get round() {
    return this.roundNumber;
  }
}
