import { BaseService } from "@port-of-mars/server/services/db";
import { matchMaker } from "colyseus";
import { Teacher, Classroom, Student, User, Game } from "@port-of-mars/server/entity";
import { ClassroomLobbyRoom } from "../rooms/lobby/classroom";
import { GameRoom } from "@port-of-mars/server/rooms/game"; //FIXME; may need to adjust for educator version
import { ServerError, generateUsername, generateCode } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
import { PlayerSummary, RoundSummary } from "@port-of-mars/server/rooms/game/state";

import {
  StudentData,
  InspectData,
  ActiveRoomData,
  // ClassroomData,
  TeacherData,
  GameReport,
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

  async getCompletedGamesForClassroom(classroomId: number): Promise<any[]> {
    const query = this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.players", "player")
      .leftJoinAndSelect("player.user", "user")
      .leftJoinAndSelect(
        "game.events",
        "gameEvent",
        "gameEvent.type = 'taken-round-snapshot' OR gameEvent.type = 'sent-chat-message'"
      )
      .where("game.classroomId = :classroomId", { classroomId });

    const games = await query.getMany();

    return games.map(game => {
      const roundSnapshots: RoundSummary[] = game.events
        .filter(event => event.type === "taken-round-snapshot")
        .map(event => {
          return typeof event.payload === "string" ? JSON.parse(event.payload) : event.payload;
        });
      console.log("Parsed roundSnapshots:", roundSnapshots);

      //fixme
      const chatLogs = game.events
        .filter(event => event.type === "sent-chat-message")
        .map(event => {
          const messageData =
            typeof event.payload === "string" ? JSON.parse(event.payload) : event.payload;
          const matchingPlayer = game.players.find(
            player =>
              player.user?.username === messageData.sender || player.role === messageData.role
          );

          const sender = matchingPlayer?.user?.username || messageData.sender || "Unknown";
          const playerRole = matchingPlayer?.role || "Unknown";
          const roundIndex = roundSnapshots.findIndex(
            snapshot =>
              snapshot.players && Object.values(snapshot.players).some(p => p.role === playerRole)
          );
          const round = roundIndex >= 0 ? roundIndex + 1 : 0;

          return {
            // sender: messageData.sender || "Unknown",
            // message: messageData.message || "",
            // timestamp: new Date(event.dateCreated).toLocaleString(),
            sender: sender,
            message: messageData.message || "",
            role: playerRole,
            dateCreated: new Date(event.dateCreated).toLocaleString(),
            round: round,
          };
        });

      console.log("Chat History Extracted: ", chatLogs);

      const systemHealthByRound: number[] = roundSnapshots.map(
        snapshot => snapshot.systemHealth ?? 0
      );
      console.log("Extracted System Healthby round from Snapshot:", systemHealthByRound);

      const playerPointsMap: { [username: string]: number[] } = {};

      for (const player of game.players) {
        const username = player.user?.username || "Unknown";
        playerPointsMap[username] = Array(roundSnapshots.length).fill(0);
      }
      console.log("Initialized playerPointsMap:", playerPointsMap);

      for (let roundIndex = 0; roundIndex < roundSnapshots.length; roundIndex++) {
        const snapshot = roundSnapshots[roundIndex];

        if (!snapshot.players) continue;
        //console.log(`Processing round ${roundIndex + 1}:`, snapshot.players);

        for (const playerSnapshot of Object.values(snapshot.players)) {
          // console.log("Player Snapshot:", playerSnapshot);
          const matchingPlayer = game.players.find(player => player.role === playerSnapshot.role);
          const username = matchingPlayer?.user?.username || "Unknown";
          const points = (playerSnapshot as any).victoryPoints ?? 0;

          if (!playerPointsMap[username]) {
            playerPointsMap[username] = Array(roundSnapshots.length).fill(0);
          }
          playerPointsMap[username][roundIndex] = points;
          // console.log(
          //   `Assigned ${points} points for player '${username}' in round ${roundIndex + 1}`
          // );
        }
      }

      console.log("Final playerPointsMap:", playerPointsMap);

      const playersWithPointsByRound = game.players.map(player => {
        const username = player.user?.username || "Unknown";
        const pointsByRound = playerPointsMap[username] || [];

        console.log(
          `Player: ${username}, Total Points: ${player.points}, Points By Round:`,
          pointsByRound
        );

        return {
          name: player.user?.name || "Unknown",
          username: username,
          isSystemBot: player.user?.isSystemBot ?? false,
          points: player.points || 0,
          role: player.role,
          pointsByRound: pointsByRound,
        };
      });

      games.sort((a, b) => a.id - b.id);

      return {
        id: game.id,
        dateFinalized: game.dateFinalized?.toISOString() || "",
        status: game.status,
        players: playersWithPointsByRound,
        systemHealthByRound: systemHealthByRound,
        chatMessages: chatLogs,
      };
    });
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
