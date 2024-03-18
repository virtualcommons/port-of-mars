import { BaseService } from "@port-of-mars/server/services/db";
import { Teacher, Classroom, Student, User } from "@port-of-mars/server/entity";
import { ServerError, generateUsername } from "@port-of-mars/server/util";
// import { settings } from "@port-of-mars/server/settings";

// const logger = settings.logging.getLogger(__filename);

export class EducatorService extends BaseService {
  async getTeacherByUserId(userId: number) {
    return this.em.getRepository(Teacher).findOne({
      where: { userId },
    });
  }

  async createStudent(classroomAuthToken: string) {
    /**
     * Create a new user account and matching Student in the given classroom
     */
    const userRepo = this.em.getRepository(User);
    const classroomRepo = this.em.getRepository(Classroom);
    const studentRepo = this.em.getRepository(Student);
    const classroom = await classroomRepo.findOne({
      where: { authToken: classroomAuthToken },
    });
    if (!classroom) {
      throw new ServerError({
        code: 404,
        message: "Classroom not found",
      });
    }

    const user = new User();
    user.name = "";
    user.username = await generateUsername();
    await userRepo.save(user);

    const student = new Student();
    student.user = user;
    student.classroom = classroom;
    await studentRepo.save(student);

    return user;
  }
}
