import { BaseService } from "@port-of-mars/server/services/db";
import { Teacher, Classroom, Student, User } from "@port-of-mars/server/entity";
import { ServerError, generateUsername } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
// import { settings } from "@port-of-mars/server/settings";

// const logger = settings.logging.getLogger(__filename);

export class EducatorService extends BaseService {
  async getTeacherByUserId(userId: number) {
    return this.em.getRepository(Teacher).findOne({
      where: { userId },
    });
  }

  async generateStudentPassword() {}

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
    student.password = "something"; //FIXME
    await studentRepo.save(student);

    return user;
  }

  async createTeacher(email: string, username: string, name: string) {
    const userRepo = this.em.getRepository(User);
    const teacherRepo = this.em.getRepository(Teacher);
    const user = await getServices().account.getOrCreateUser({ email, username, name });
    // skip the usual verification/consent
    user.dateConsented = new Date();
    user.isVerified = true;
    userRepo.save(user);
    const teacher = teacherRepo.create({
      user,
      userId: user.id,
      password: "", // FIXME: generate a password, how to keep this secure but generated?
    });
    return teacherRepo.save(teacher);
  }

  async createClassroomForTeacher(username: string, descriptor: string) {
    const teacher = await this.em
      .getRepository(Teacher)
      .createQueryBuilder("teacher")
      .innerJoinAndSelect("teacher.user", "user")
      .where("user.username = :username", { username })
      .getOneOrFail();

    const repo = this.em.getRepository(Classroom);
    const classroom = repo.create({
      teacher,
      teacherId: teacher.id,
      descriptor,
      authToken: "asdf", // FIXME: generate this
    });
    return repo.save(classroom);
  }
}
