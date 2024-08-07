import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { ValidationError } from "@port-of-mars/server/util";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const educatorRouter = Router();

educatorRouter.use(isAuthenticated);

educatorRouter.get("/student", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const student = await getServices().educator.getStudentByUser(user.id, true);
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

educatorRouter.get("/classroom-games", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const classroomId = Number(req.query.classroomId);
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
      res.status(403).json({ message: "Only teachers can get classroom games" });
      return;
    }
    const games = await services.educator.getActiveRoomsForClassroom(classroomId);
    res.status(200).json(games);
  } catch (e) {
    logger.warn(`Unable to get classroom games for classroom ID ${classroomId}`);
    next(e);
  }
});

educatorRouter.get("/inspect-room", async (req: Request, res: Response, next) => {
  const roomId = req.query.roomId as string;
  try {
    const room = await getServices().educator.getInspectData(roomId);
    if (!room) {
      res.status(204).send(`"Room ${roomId} not found"`);
      return;
    }
    res.json(room);
  } catch (e) {
    next(e);
  }
});

educatorRouter.get("/classrooms", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  try {
    const classrooms = await getServices().educator.getClassroomsForTeacher(user.id);
    res.json(classrooms);
  } catch (e) {
    logger.warn("Unable to get classrooms for teacher with user ID %d", user.id);
    next(e);
  }
});

educatorRouter.get("/students", async (req: Request, res: Response, next) => {
  const classroomId = Number(req.query.classroomId);
  try {
    const students = await getServices().educator.getStudentsByClassroomId(Number(classroomId));
    res.json(students);
  } catch (e) {
    logger.warn("Unable to get students from classroom with ID %d", classroomId);
    next(e);
  }
});

educatorRouter.post("/classroom", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const { descriptor } = req.body;

  logger.info("Request body: ", req.body);
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
      res.status(403).json({ message: "Only teachers can create a classroom" });
      return;
    }
    const newClassroom = await services.educator.createNewClassroom(teacher, descriptor);
    res.status(201).json(newClassroom);
  } catch (e) {
    logger.warn("Unable to create a new classroom for the teacher");
    if (e instanceof Error) {
      res.status(400).json({ message: e.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
    next(e);
  }
});

educatorRouter.delete("/classroom", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const { classroomId } = req.body;
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
      res.status(403).json({ message: "Only teachers can delete a classroom" });
      return;
    }
    await services.educator.deleteClassroom(teacher, classroomId);
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ message: e.message });
    } else {
      logger.warn("Unable to delete classroom");
      next(e);
    }
  }
});

educatorRouter.put("/classroom", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const { classroomId, descriptor } = req.body;

  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
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

educatorRouter.get("/completed-games", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const classroomId = Number(req.query.classroomId);

  if (!classroomId) {
    res.status(400).json({ message: "ClassroomId is required" });
    return;
  }

  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
      res.status(403).json({ message: "Only teachers can get a list of completed games" });
      return;
    }
    const games = await services.educator.getCompletedGamesForClassroom(classroomId);
    res.status(200).json(games);
  } catch (e) {
    logger.warn("Unable to get a list of finalized games for classroom");
    next(e);
  }
});

educatorRouter.get("/lobby-clients", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  const classroomId = Number(req.query.classroomId);
  try {
    const services = getServices();
    const teacher = await services.educator.getTeacherByUserId(user.id);
    if (!teacher) {
      res
        .status(403)
        .json({ message: "Only teachers can get a list of clients for the classroom lobby" });
      return;
    }
    const clients = await services.educator.getLobbyClients(classroomId);
    res.status(200).json(clients);
  } catch (e) {
    logger.warn("Unable to get list of clients for the classroom lobby");
    next(e);
  }
});

educatorRouter.post("/confirm-student", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const data = { ...req.body };

    //make sure that first and last name are filled out
    if (!data.name) {
      throw new ValidationError({
        displayMessage: "Student name is required",
      });
    }
    await getServices().educator.setStudentName(user.id, data.name);
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
});

educatorRouter.post(
  "/start-classroom-games",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const { classroomId } = req.body;
    try {
      const services = getServices();
      const teacher = await services.educator.getTeacherByUserId(user.id);
      if (!teacher) {
        res.status(403).json({ message: "Only teachers can start the game" });
        return;
      }
      await services.educator.startClassroomGames(classroomId);
      res.status(200).json({ message: "Games have been started" });
      return;
    } catch (e) {
      logger.warn("Unable to start classroom games", e);
      next(e);
    }
  }
);
