import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { TournamentRoundInvite } from "./TournamentRoundInvite";
import { TournamentRoundDate } from "./TournamentRoundDate";

@Entity()
export class TournamentRoundSignup {
  @PrimaryColumn()
  tournamentRoundInviteId!: number;

  @ManyToOne(() => TournamentRoundInvite, invite => invite.signups)
  tournamentRoundInvite!: TournamentRoundInvite;

  @PrimaryColumn()
  tournamentRoundDateId!: number;

  @ManyToOne(() => TournamentRoundDate, date => date.signups)
  tournamentRoundDate!: TournamentRoundDate;
}
