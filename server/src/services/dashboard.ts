import {EntityManager} from "typeorm";
import {User} from '@port-of-mars/server/entity/User';
import {Role} from "@port-of-mars/shared/types";
import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";


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

export class DashboardService {
  constructor(public em: EntityManager) {}

  // async sendDashboardData(): Promise<DashboardData>{
    
    
  //   return {

  //   }
  // }

  async hasUserPassedTutorial(user: User): Promise<ActionItem> {
    return {
      done: user.passedQuiz,
      description: 'Complete Tutorial',
      link: ''
    }
  }


  async getIntroSurveyUrl(tournamentRound: TournamentRound | undefined): Promise<ActionItem | undefined>{
    if(!tournamentRound){
      return undefined;
    }

    if(!tournamentRound.introSurveyUrl){
      return undefined;
    }

    return {
      done: false,
      description: 'Complete Introduction Survey',
      link: tournamentRound.introSurveyUrl
    }
  }

  async getExitSurveyUrl(tournamentRound: TournamentRound| undefined): Promise<ActionItem | undefined> {
    if(!tournamentRound){
      return undefined;
    }

    if(!tournamentRound.exitSurveyUrl){
      return undefined;
    }

    return {
      done: false,
      description: 'Complete Exit Survey',
      link: tournamentRound.exitSurveyUrl,

    }
  }


}
