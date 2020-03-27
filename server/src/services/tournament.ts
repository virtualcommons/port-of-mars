import { Tournament, TournamentRound, TournamentRoundInvite } from '@port-of-mars/server/entity';
import { getConnection } from '@port-of-mars/server/util'
import { settings } from '@port-of-mars/server/settings';

const logger = settings.logging.getLogger(__filename);

export async function getActiveTournament(): Promise<Tournament> {
  const currentTournament = await getConnection().getRepository(Tournament).findOneOrFail({
    order: { dateCreated: 'DESC' },
    where: { active: true }
  });
  return currentTournament;
}

export async function getCurrentTournamentRound(tournament?: Tournament): Promise<TournamentRound> {
  if (!tournament) {
    tournament = await getActiveTournament();
  }
  return await getConnection().getRepository(TournamentRound).findOneOrFail({
    order: { roundNumber: 'DESC' },
    where: { tournamentId: tournament.id }
  });
}