export default class Synthetic {
  playerRole: string = 'Pioneer';

  roundNumber: number = 0;

  roundCosts: object = {
    government: -1,
    legacy: 3,
    upkeep: 1,
    finance: 3,
    science: -1,
    culture: 2,
  }

  get player() {
    return this.playerRole;
  }

  get round() {
    return this.roundNumber;
  }
}
