import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { ValidationError } from "@port-of-mars/server/util";
import { getLogger } from "@port-of-mars/server/settings";
import { ClassroomLobbyRoom } from "../rooms/lobby/classroom";
import { matchMaker } from "colyseus";
import { Classroom, Teacher } from "../entity";

const logger = getLogger(__filename);

export const educatorRouter = Router();

educatorRouter.use(isAuthenticated);

educatorRouter.get("/student", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const student = await services.educator.getStudentByUser(user.id, true);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }
    res.json(student);
    return;
  } catch (e) {
    logger.warn("Unable to authorize student for user ID %d", user.id);
    next(e);
  }
});

educatorRouter.get("/rooms", async (req: Request, res: Response, next) => {
  try {
    const rooms = await getServices().educator.getActiveRooms();
    res.json(rooms);
  } catch (e) {
    logger.warn("Unable to get rooms", e)
    next(e);
  }
});

educatorRouter.get("/classroom-games", async (req: Request, res: Response, next) => {
  const { classroomId } = req.body;
  try {
    const services = getServices();
    const games = await services.educator.getActiveRoomsForClassroom(Number(classroomId));
    res.json(games);
  } catch (e) {
    logger.warn("Unable to get classroom games for classroom ID %d", classroomId); 
    next(e);
  }
});

educatorRouter.get("/classrooms",  async (req: Request, res: Response, next) =>{
  const user = req.user as User;
  try {
    const services = getServices();
    const classrooms = await services.educator.getClassroomsForTeacher(user.id);
    res.json(classrooms);
  } catch (e) {
    logger.warn("Unable to get classrooms for teacher with user ID %d", user.id);
    next(e);
  }
});

educatorRouter.get("/students", async (req: Request, res: Response, next) =>{
  const { classroomId } = req.body;
  try {
    const services = getServices();
    const students = await services.educator.getStudentsByClassroomId(Number(classroomId));
    res.json(students);
  } catch (e) {
    logger.warn("Unable to get students from classroom with ID %d", classroomId);
    next(e);
  }
});

educatorRouter.post("/classroom", async (req: Request, res: Response, next) =>{
  const user = req.user as User;
  const { descriptor } = req.body;
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher || user.isAdmin){
      res.status(403).json({ message: "Only teachers can create a classroom" });
      return;
    }
    const newClassroom = await services.educator.createNewClassroom(teacher, descriptor);
    res.status(201).json(newClassroom);
  } catch (e) {
    logger.warn("Unable to create a new classroom for the teacher");
    next(e);
  }
});

educatorRouter.delete("/classroom", async (req: Request, res: Response, next) =>{
  const user = req.user as User;
  const { classroomId } = req.body;
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher || user.isAdmin){
      res.status(403).json({ message: "Only teachers can delete a classroom" });
      return;
    }
    // const classroomRepo = services.em.getRepository(Classroom);
    // const classroom = await classroomRepo.findOne({
    //   where: {id: classroomId, teacher: {id: teacher.id}},
    // })
    // if (!classroom){
    //   res.status(404).json({ message: "Classroom not found" });
    //   return;
    // }
    // //if number of games or number of students in classroom is greater than 0, then error
    // const students = await services.educator.getStudentsByClassroomId(classroomId);
    // const games = await services.educator.getActiveRoomsForClassroom(classroomId);
    // if (students.length > 0 || games.length > 0){
    //   res.status(400).json({ message: "Classroom cannot be deleted because it has active games and/or students"});
    //   return;
    // }
    // await classroomRepo.remove(classroom);

    await services.educator.deleteClassroom(teacher, classroomId);
  } catch (e) {
    logger.warn("Unable to delete classroom");
    next(e);
  }
});

educatorRouter.put("/classroom", async (req: Request, res: Response, next) =>{
  const user = req.user as User;
  const { classroomId, descriptor } = req.body;

  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher || user.isAdmin){
      res.status(403).json({ message: "Only teachers can update a classroom" });
      return;
    }
    const classroom = await services.educator.updateClassroom(teacher, classroomId, descriptor);   
    res.status(200).json(classroom);
  } catch (e) {
    logger.warn("Unable to update classroom");
    next(e);
  }
});

educatorRouter.get("/lobby", async (req: Request, res: Response, next) =>{
  const user = req.user as User;
  const { classroomId} = req.body;
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher || user.isAdmin){
      res.status(403).json({ message: "Only teachers can get a list of clients for the classroom lobby" });
      return;
    }

    const lobbies = (await matchMaker.query({
      name: ClassroomLobbyRoom.NAME,
      classroomId,
    })) as any;
    const lobby = lobbies.find((room: any) => lobby.classroomId === classroomId);

    if (!lobby){
      res.status(404).json({ message: "Classroom lobby not found" });
      return;
    }
    const clients = lobby.clients;
    res.status(200).json(clients);

  } catch (e) {
    logger.warn("Unable to get list of clients for the classroom lobby");
    next(e);
  }

});

educatorRouter.post("/confirm-student", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const data = { ...req.body };

    //make sure that first and last name are filled out
    if (!data.name) {
      throw new ValidationError({
        displayMessage: "Student name is required",
      });
    }
    await services.educator.setStudentName(user.id, data.name);
    res.status(200).json({ message: "Student confirmed successfully" });
    return;
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(e.code).json(e.toDashboardMessage());
    } else {
      logger.warn("unable to confirm student: user ID %d", user.id);
      next(e);
    }
  }

  educatorRouter.post(
    "/start-classroom-games",
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as User;
      const { classroomId } = req.body;
      try {
        const services = getServices();
        const teacher = await services.educator.getTeacherByUserId(user.id);
        if (!(teacher || user.isAdmin)) {
          res.status(403).json({ message: "Only teachers can start the game" });
          return;
        }
        const room = (await matchMaker.query({
          name: ClassroomLobbyRoom.NAME,
          classroomId,
        })) as any;
        await matchMaker.remoteRoomCall(room.roomId, "startGames");
        res.status(200).json({ message: "Games have been started" });
        return;
      } catch (e) {
        logger.warn("Unable to start classroom games", e);
        next(e);
      }
    }
  );
});
