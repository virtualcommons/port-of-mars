import { Vue, Component } from 'vue-property-decorator';
import { url } from '@port-of-mars/client/util';
import { DashboardData } from '@port-of-mars/shared/types';

@Component({})
export class DashboardAPI extends Vue {
  async getData(): Promise<DashboardData> {
    try {
      return await this.$ajax.get(url('/dashboard/'), ({data, status}) => {
        return data;
      });
    }
    catch (e) {
      return {
        actionItems: [],
        upcomingGames: [],
        stats: {
          games: []
        }
      };
    }
  }
}
