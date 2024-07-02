import { BaseService } from "@port-of-mars/server/services/db";
import { Teacher, Classroom, Student, User } from "@port-of-mars/server/entity";
import { ServerError, generateUsername, generateCode } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
import { error } from "console";
// import { settings } from "@port-of-mars/server/settings";

// const logger = settings.logging.getLogger(__filename);

export class EducatorService extends BaseService {
  async getTeacherByUserId(userId: number, withUser = false) {
    return this.em.getRepository(Teacher).findOne({
      where: { userId },
      relations: withUser ? ["user"] : [],
    });
  }

  async getTeacherByUsernameAndPassword(username: string, password: string, withUser = false) {
    return this.em.getRepository(Teacher).findOne({
      where: { user: { username }, password },
      relations: ["user"],
    });
  }

  async getStudentByUser(userId: number, withUser = false) {
    return this.em.getRepository(Student).findOne({
      where: { userId },
      relations: withUser ? ["user"] : [],
    });
  }

  async getStudentByRejoinCode(rejoinCode: string, withUser = false) {
    return this.em.getRepository(Student).findOne({ where: { rejoinCode }, relations: ["user"] });
  }

  async generateStudentRejoinCode(): Promise<string> {
    let rejoinCode = "";
    do {
      rejoinCode = generateCode(7, "alphabetic");
    } while (await this.em.getRepository(Student).findOne({ where: { rejoinCode } }));
    return rejoinCode;
  }

  async generateTeacherPassword(): Promise<string> {
    let password = "";
    do {
      password = generateCode(10, "alphanumeric");
    } while (await this.em.getRepository(Teacher).findOne({ where: { password } }));
    return password;
  }

  async generateAuthToken(): Promise<string> {
    let authToken = "";
    do {
      authToken = generateCode(5, "numeric");
    } while (await this.em.getRepository(Classroom).findOne({ where: { authToken } }));
    return authToken;
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

    const student = studentRepo.create({
      user,
      userId: user.id,
      classroom,
      classroomId: classroom.id,
      rejoinCode: await this.generateStudentRejoinCode(),
    });
    await studentRepo.save(student);

    return user;
  }

  //set name and set to verified

  async setStudentName(userId: number, name: string) {
    const studentRepo = this.em.getRepository(Student);
    const student = await this.getStudentByUser(userId, true);
    if (!student) {
      throw new ServerError({
        code: 404,
        message: "Student not found",
      });
    }

    console.log('Fetched student:', student);
    student.user.name = name;
    await studentRepo.save(student);

    student.user.isVerified = true;
    await studentRepo.save(student.user);

    await this.em.getRepository(User).save(student.user);

    console.log('Updated student:', student);
    await studentRepo.save(student);
    return student;
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
      password: await this.generateTeacherPassword(),
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
      authToken: await this.generateAuthToken(),
    });
    return repo.save(classroom);
  }
  
  //This algo. works weird with specfically 6 -> [2,4] 
  async partition(students: number): Promise<number[]> {
    const arr = [];
    const fullGroups = Math.floor(students / 5);
    const leftOver = students % 5;
    for (let i = 0; i < fullGroups; i++){
      arr.push(5);
    }
    if (leftOver > 0){
      arr.push(leftOver);
    }
    for (let i = arr.length - 1; i > 0; i--){
      while (arr[i] < 4){
        arr[i] += 1;
        arr[i - 1] -= 1;
      }
    }
    return arr;
  }


}
