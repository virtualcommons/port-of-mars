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
      console.log("UNABLE TO GET DATA");
      console.log(e);
      // this.store.commit('SET_DASHBOARD_MESSAGE', {kind: 'danger', message: 'Unable to retrieve dashboard data, please contact us if this persists.'});
      throw e;
    }
  }
}
