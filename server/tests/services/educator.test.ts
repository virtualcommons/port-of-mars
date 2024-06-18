import { AccountService } from "@port-of-mars/server/services/account";
import { Teacher, Classroom, Student } from "@port-of-mars/server/entity";
import { EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { initTransaction, rollbackTransaction } from "../common";
import { EducatorService } from "@port-of-mars/server/services/educator";

describe("the educator service", () => {
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  //let t: Tournament;
  let accountService: AccountService;
  let educatorService: EducatorService;
  const teacherUsername = "teacher";
  let teacher: Teacher;

  beforeAll(async () => {
    [qr, manager] = await initTransaction();
    sp = new ServiceProvider(manager);
    accountService = sp.account;
    educatorService = sp.educator;
    teacher = await educatorService.createTeacher(
      "teacher@example.com",
      teacherUsername,
      "Teacher One"
    );
  });

  it("educators can sign up", async () => {
    for (let i = 0; i < 10; i++) {
      //Creates mock data of teachers
      const username = teacherUsername + `${i}`;
      const email = username + "@gmail.com";
      const name = teacherUsername.toUpperCase() + ` ${i}`;
      await sp.educator.createTeacher(email, username, name);
    }
    //Retrieve all passwords in Teacher repo to check uniqueness
    const teacherRepo = educatorService.em.getRepository(Teacher);
    const data = await teacherRepo.find({ select: { password: true } });
    const passwords = data.map(teacher => teacher.password);
    const uniquePasswords = new Set(passwords);
    expect(passwords.length).toEqual(uniquePasswords.size);
  });

  it("classrooms can be created", async () => {
    const descriptor = "desc";
    for (let i = 0; i < 10; i++) {
      await sp.educator.createClassroomForTeacher(teacher.user.username, descriptor + `${i}`);
    }
    const classroomRepo = educatorService.em.getRepository(Classroom);
    const data = await classroomRepo.find({ select: { authToken: true } });
    const tokens = data.map(classroom => classroom.authToken);
    const uniqueTokens = new Set(tokens);
    expect(tokens.length).toEqual(uniqueTokens.size);
  });

  it("students can sign up", async () => {
    const classroom = await sp.educator.createClassroomForTeacher(
      teacher.user.username,
      "descriptor"
    );
    for (let i = 0; i < 10; i++) {
      await sp.educator.createStudent(classroom.authToken);
    }
    const studentRepo = educatorService.em.getRepository(Student);
    const data = await studentRepo.find({ select: { rejoinCode: true } });
    const rejoinCodes = data.map(student => student.rejoinCode);
    const uniqueRejoinCodes = new Set(rejoinCodes);
    expect(rejoinCodes.length).toEqual(uniqueRejoinCodes.size);
  });
  afterAll(async () => rollbackTransaction(qr));
});
