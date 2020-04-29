import { Vue, Component } from 'vue-property-decorator';
import { url } from '@port-of-mars/client/util';
import { DashboardData } from '@port-of-mars/shared/types';

@Component({})
export class DashboardAPI extends Vue {
  async getData(): Promise<DashboardData> {
    let data = await this.$ajax.get(url('/dashboard/'));

    if (data.status == 200) {
      return data.json();
    }
    return {
      actionItems: [],
      upcomingGames: [],
      stats: {
        games: [],
      },
    };
  }
}
