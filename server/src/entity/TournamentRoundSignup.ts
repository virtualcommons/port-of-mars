import { Entity, ManyToOne } from "typeorm";
import { TournamentRoundInvite } from "./TournamentRoundInvite";
import { TournamentRoundDate } from "./TournamentRoundDate";

@Entity()
export class TournamentRoundSignup {
  @ManyToOne(type => TournamentRoundInvite, invite => invite.signups, { primary: true })
  tournamentRoundInvite!: TournamentRoundInvite;

  @ManyToOne(type => TournamentRoundDate, date => date.signups, { primary: true })
  tournamentRoundDate!: TournamentRoundDate;
}
