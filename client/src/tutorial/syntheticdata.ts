export default class Synthetic {
  playerRole: string = 'Curator';

  roundNumber: number = 0;

  get player() {
    return this.playerRole;
  }

  get round() {
    return this.roundNumber;
  }
}
