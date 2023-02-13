import { ServiceProvider } from "@port-of-mars/server/services/index";

export class BaseService {
  constructor(public sp: ServiceProvider) {}

  get em() {
    return this.sp.em;
  }
}
