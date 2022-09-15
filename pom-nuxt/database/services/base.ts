import { ServiceProvider } from "../index";

export class BaseService {
  constructor(public sp: ServiceProvider) {}

  get em() {
    return this.sp.em;
  }
}
