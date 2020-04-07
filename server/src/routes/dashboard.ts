export const dashboardRouter = Router();

interface ActionItem {
  done: boolean
  description: string
  link: string
}

interface GameMeta {
  time: number // unix timestamp
  round: number
  tournamentName: string
}

interface Stats {
  games: Array<GameMeta & {points: number, winner: Role}>
}

interface DashboardData {
  actionItems: Array<ActionItem>
  upcomingGames: Array<GameMeta>
  stats: Stats
}

dashboardRouter.get('', async (req, res, next) => {
  res.json({
    actionItems: [],
    upcomingGames: [],
    stats: [],
  });
});
