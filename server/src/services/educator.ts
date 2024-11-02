import { BaseService } from "@port-of-mars/server/services/db";
import { matchMaker } from "colyseus";
import { Teacher, Classroom, Student, User, Game } from "@port-of-mars/server/entity";
import { ClassroomLobbyRoom } from "../rooms/lobby/classroom";
import { GameRoom } from "@port-of-mars/server/rooms/game"; //FIXME; may need to adjust for educator version
import { ServerError, generateUsername, generateCode } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
import {
  StudentData,
  InspectData,
  ActiveRoomData,
  // ClassroomData,
  TeacherData,
} from "@port-of-mars/shared/types";

export class EducatorService extends BaseService {
  async getTeacherByUserId(userId: number, withUser = false): Promise<Teacher | null> {
    return this.em.getRepository(Teacher).findOne({
      where: { userId },
      relations: withUser ? ["user"] : [],
    });
  }

  async getTeacherByUsernameAndPassword(
    username: string,
    password: string,
    withUser = false
  ): Promise<Teacher | null> {
    return this.em.getRepository(Teacher).findOne({
      where: { user: { username }, password },
      relations: ["user"],
    });
  }

  async getStudentByUser(userId: number, withUser = false): Promise<Student | null> {
    return this.em.getRepository(Student).findOne({
      where: { userId },
      relations: withUser ? ["user"] : [],
    });
  }

  async getStudentByRejoinCode(rejoinCode: string, withUser = false): Promise<Student | null> {
    return this.em.getRepository(Student).findOne({ where: { rejoinCode }, relations: ["user"] });
  }

  async getClassroomById(id: number, withTeacher = false): Promise<Classroom | null> {
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

  async updateClassroom(teacher: Teacher, classroomId: number, descriptor: string): Promise<void> {
    const classroomRepo = this.em.getRepository(Classroom);
    const classroom = await classroomRepo.findOne({
      where: { id: classroomId, teacher: { id: teacher.id } },
    });
    if (!classroom) {
      throw new Error("Classroom not found");
    }
    classroom.descriptor = descriptor;
    await classroomRepo.save(classroom);
    return;
  }

  async createNewClassroom(teacher: Teacher, descriptor: string): Promise<Classroom> {
    const classroomRepo = this.em.getRepository(Classroom);
    const authToken = await this.generateAuthToken();
    const newClassroom = classroomRepo.create({
      descriptor: descriptor,
      teacher: teacher,
      authToken: authToken,
    });
    return classroomRepo.save(newClassroom);
  }

  async getLobbyClients(classroomId: number): Promise<Array<StudentData>> {
    const lobbies = (await matchMaker.query({
      name: ClassroomLobbyRoom.NAME,
    })) as any;
    const lobby = lobbies.find((room: any) => room.metadata.classroomId === classroomId);
    return lobby ? lobby.metadata.clients : [];
  }

  async startClassroomGames(classroomId: number): Promise<void> {
    const rooms = await matchMaker.query({
      name: ClassroomLobbyRoom.NAME,
    });
    const room = rooms.filter((room: any) => room.metadata.classroomId === classroomId)[0];
    if (!room) {
      throw new ServerError({
        code: 404,
        message: "Classroom lobby not found",
      });
    }
    const data = await matchMaker.remoteRoomCall(room.roomId, "startGames");
    console.log("Data: ", data);
    return;
  }

  async getActiveRoomsForClassroom(classroomId: number): Promise<Array<ActiveRoomData>> {
    const games = await matchMaker.query({ name: GameRoom.NAME });
    const classroomGames = games.filter((game: any) => game.metadata.classroomId === classroomId);
    if (!classroomGames) {
      throw new Error("No active classroom games found.");
    }
    return classroomGames.map((g: any) => {
      return {
        roomId: g.roomId,
        clients: g.clients,
        elapsed: Date.now() - new Date(g.createdAt).getTime(),
      };
    });
  }

  async getInspectData(roomId: string): Promise<InspectData | undefined> {
    if (roomId && (await matchMaker.query({ roomId }))) {
      try {
        const data = await matchMaker.remoteRoomCall(roomId, "getInspectData");
        return data;
      } catch (e) {
        return undefined;
      }
    }
  }

  async getCompletedGamesForClassroom(classroomId: number): Promise<Array<Game>> {
    // FIXME: the entire game object with all of the relations is huge and includes some sensitive data
    // create a new data type game reports that includes only the necessary data to display
    // an overview table and details for each game
    const query = this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.players", "player")
      .leftJoinAndSelect("player.user", "user")
      .select([
        "game.id",
        "game.dateFinalized",
        "game.status",
        "player.id",
        "user.name",
        "user.username",
        "user.isSystemBot",
      ])
      .where("game.classroomId = :classroomId", { classroomId });
    const games = await query.getMany();
    console.log("games data returned: ", games);
    return games;
    //OLD VERSION:
    // const query = this.em
    //   .getRepository(Game)
    //   .createQueryBuilder("game")
    //   .leftJoinAndSelect("game.players", "player")
    //   .leftJoinAndSelect("player.user", "user")
    //   .leftJoinAndSelect("game.tournamentRound", "tournamentRound")
    //   .leftJoinAndSelect("tournamentRound.tournament", "tournament")
    //   .leftJoinAndSelect("game.events", "gameEvent", "gameEvent.type = 'taken-round-snapshot'")
    //   .where("game.classroomId = :classroomId", { classroomId });

    // return query.getMany();
  }

  async deleteClassroom(teacher: Teacher, classroomId: number, force = false): Promise<void> {
    const classroomRepo = this.em.getRepository(Classroom);
    const classroom = await classroomRepo.findOne({
      where: { id: classroomId, teacher: { id: teacher.id } },
    });
    if (!classroom) {
      throw new Error("Classroom not found");
    }
    if (!force) {
      const students = await this.getStudentsByClassroomId(classroomId);
      const games = await this.getActiveRoomsForClassroom(classroomId);
      if (students.length > 0 || games.length > 0) {
        throw new Error("Classroom cannot be deleted because it has active games and/or students");
      }
    }
    await classroomRepo.remove(classroom);
    return;
  }

  async getClassroomsForTeacher(userId: number): Promise<Array<Classroom>> {
    const classroomRepo = this.em.getRepository(Classroom);
    const teacher = await this.getTeacherByUserId(userId);

    if (!teacher) {
      throw new ServerError({
        code: 404,
        message: "Teacher not found",
      });
    }
    const classrooms = classroomRepo.find({
      where: { teacher: teacher },
    });
    return classrooms;
  }

  async getStudentsByClassroomId(
    classroomId: number,
    onlyVerified = true
  ): Promise<Array<StudentData>> {
    const studentRepo = this.em.getRepository(Student);
    const students = await studentRepo.find({
      where: { classroomId: classroomId },
      relations: ["user"],
    });
    return students
      .filter(student => !onlyVerified || student.user.isVerified)
      .map(student => {
        return {
          id: student.id,
          username: student.user.username,
          name: student.user.name,
        };
      });
  }

  async createStudent(classroomAuthToken: string): Promise<User> {
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

  async setStudentName(userId: number, name: string): Promise<void> {
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
    return;
  }

  async createTeacher(email: string, username: string, name: string): Promise<Teacher> {
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

  async getSystemHealthForRound() {}

  async getChatLogForGame() {}
  async deleteTeacher(teacherId: number): Promise<void> {
    const teacherRepo = this.em.getRepository(Teacher);

    const teacher = await teacherRepo.findOne({ where: { id: teacherId } });

    if (!teacher) {
      throw new ServerError({
        code: 404,
        message: "Teacher not found",
      });
    }

    await teacherRepo.remove(teacher);
    return;
  }

  async getAllTeachers(): Promise<Array<TeacherData>> {
    const teacherRepo = this.em.getRepository(Teacher);
    const teachers = await teacherRepo.find({ relations: ["user"] });

    return teachers.map((teacher: Teacher) => ({
      teacherId: teacher.id,
      username: teacher.user.username,
      name: teacher.user.name,
      email: teacher.user.email,
    }));
  }
}
