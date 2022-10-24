import { url } from '@port-of-mars/client/util';
import { DashboardData } from '@port-of-mars/shared/types';
import { TStore } from '@port-of-mars/client/plugins/tstore';
import { AjaxRequest } from '@port-of-mars/client/plugins/ajax';

export class DashboardAPI {

  constructor(public store: TStore, public ajax: AjaxRequest) {}

  message(message: string, kind: 'warning'|'info'|'danger'='info') {
    this.store.commit('SET_DASHBOARD_MESSAGE', {kind, message});
  }

  async getData(): Promise<DashboardData> {
    try {
      return await this.ajax.get(url('/dashboard/'), ({data, status}) => {
        return data;
      });
    }
    catch (e) {
      console.log("Unable to retrieve DashboardData");
      console.log(e);
      // this.store.commit('SET_DASHBOARD_MESSAGE', {kind: 'danger', message: 'Unable to retrieve dashboard data, please contact us if this persists.'});
      throw e;
    }
  }

  async isLobbyOpen(): Promise<boolean> {
    try {
      return await this.ajax.get(url('/dashboard/lobby-status'), ({data, status}) => {
        return data;
      });
    }
    catch (e) {
      console.log("Unable to retrieve lobby status");
      console.log(e);
      throw e;
    }
  }
}
