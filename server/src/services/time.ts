import { BaseService } from "@port-of-mars/server/services/db";

export class TimeService extends BaseService {
  now(): Date {
    return new Date();
  }
}
