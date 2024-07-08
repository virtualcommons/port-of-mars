import { BaseService } from "@port-of-mars/server/services/db";
import { matchMaker } from "colyseus";
import { Teacher, Classroom, Student, User, Game } from "@port-of-mars/server/entity";
import { GameRoom } from "@port-of-mars/server/rooms/game"; //FIXME; may need to adjust for educator version
import { ServerError, generateUsername, generateCode } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
import { error } from "console";
import { getRepository } from "typeorm";
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

  async getClassroomById(id: number, withTeacher = false) {
    return this.em.getRepository(Classroom).findOne({
      where: { id },
      relations: withTeacher ? ["teacher"] : [],
    });
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

  async getActiveRooms(): Promise<any> {
    const games = await matchMaker.query({ name: GameRoom.NAME });
    return games.map((g: any) => {
      return {
        roomId: g.roomId,
        clients: g.clients,
        elapsed: Date.now() - new Date(g.createdAt).getTime(),
        type: g.type,
      };
    });
  }

  async getActiveRoomsForClassroom(classroomId: number): Promise<any> {
    const gameRepo = this.em.getRepository(Game);
    const activeGames = gameRepo.find({
      where: {id: classroomId, status: "incomplete"},
      },
    ); //FIXME: may need to add in relations
    return activeGames;
  }

  async getClassroomsForTeacher(userId: number): Promise<any>{
    const classroomRepo = this.em.getRepository(Classroom);
    const teacher = await this.getTeacherByUserId(userId);

    if (!teacher){
      throw new ServerError({
        code: 404,
        message: "Teacher not found",
      });
    }
    const classrooms = classroomRepo.find({ 
      where: {teacher: teacher },
      relations: ["students", "games"],
    },
    ); //FIXME: may need to fix in relations
    return classrooms;
  }

  async getStudentsByClassroomId(classroomId: number): Promise<any>{
    const studentRepo = this.em.getRepository(Student);
    const students = studentRepo.find({
      where: {classroomId: classroomId},
      relations: ["classroom"],
    });
    return students;
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

  async setStudentName(userId: number, name: string) {
    const student = await this.getStudentByUser(userId, true);
    if (!student) {
      throw new ServerError({
        code: 404,
        message: "Student not found",
      });
    }

    const user = student.user;
    user.name = name;
    user.isVerified = true;
    await this.em.getRepository(User).save(user);
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
}
