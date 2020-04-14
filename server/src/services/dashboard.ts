import {EntityManager} from "typeorm";
import {User} from '@port-of-mars/server/entity/User';
import {Role, ActionItem, GameMeta, Stats } from "@port-of-mars/shared/types";
import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";
import { TournamentRoundInvite } from "../entity";

interface DashboardData {
  actionItems: Array<ActionItem>
  upcomingGames: Array<GameMeta>
  stats: Stats
}

export class DashboardService {
  constructor(public em: EntityManager) {}

  hasUserPassedTutorial(user: User): ActionItem {
    return {
      done: user.passedQuiz,
      description: 'Complete Tutorial',
      link: ''
    }
  }

  getUserSurveys(tournamentRound: TournamentRound | undefined,
    inviteList: Array<TournamentRoundInvite> | undefined,
    userId: number): Array<ActionItem | undefined>{
      
      if(!tournamentRound || !inviteList){
        return [undefined, undefined]
      }

      for(let invite of inviteList){
        if(invite.userId == userId){
          return [{
            done: invite.hasCompletedIntroSurvey,
            description: 'Complete the introduction survey',
            link: tournamentRound.introSurveyUrl ? tournamentRound.introSurveyUrl : ''
          },
          {
            done: invite.hasCompletedIntroSurvey,
            description: 'Complete the exit survey',
            link: tournamentRound.exitSurveyUrl ? tournamentRound.exitSurveyUrl : ''
          }]
        }
      }    
      return [undefined, undefined];

    }


}
