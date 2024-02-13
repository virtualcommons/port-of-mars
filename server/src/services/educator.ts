import { BaseService } from "@port-of-mars/server/services/db";
import { Teacher } from "@port-of-mars/server/entity/Teacher";
// import { settings } from "@port-of-mars/server/settings";

// const logger = settings.logging.getLogger(__filename);

export class EducatorService extends BaseService {
  async getTeacherByUserId(userId: number) {
    return this.em.getRepository(Teacher).findOne({
      where: { userId },
    });
  }
}
