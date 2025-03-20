import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TrioGameRound } from "./TrioGameRound";
import { TrioPlayer } from "./TrioPlayer";
import { TrioMarsEventDeck } from "./TrioMarsEventDeck"; 

@Entity()
export class TrioPlayerDecision {
  @PrimaryGeneratedColumn()
  id!: number;

  // multiple decisions per round
  @ManyToOne(type => TrioGameRound, round => round.decisions)
  round!: TrioGameRound;

  @ManyToOne(type => TrioPlayer, player => player.decisions)
  player!: TrioPlayer;

  // represents what the player voted for
  @Column()
  vote!: string;

  @Column()
  systemHealthInvestment!: number;

  @Column()
  pointsInvestment!: number;

  // player that was voted for
  @ManyToOne(type => TrioPlayer, { nullable: true })
  votedPlayer!: TrioPlayer;

  // event being voted on
  @ManyToOne(type => TrioMarsEventDeck, { nullable: true })
  event!: TrioMarsEventDeck;
}
