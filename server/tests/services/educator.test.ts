import { AccountService } from "@port-of-mars/server/services/account";
import { User, Teacher, Tournament } from "@port-of-mars/server/entity";
import { settings } from "@port-of-mars/server/settings";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { ServerError } from "@port-of-mars/server/util";
import { createTournament, initTransaction, rollbackTransaction } from "../common";
import { EducatorService } from "@port-of-mars/server/services/educator";

describe("the educator service", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let t: Tournament;
  let accountService: AccountService;
  let educatorService: EducatorService;
  const teacherUsername = "teacher1";
  let teacher: Teacher;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    sp = new ServiceProvider(qr.manager);
    accountService = sp.account;
    educatorService = sp.educator;
    teacher = await educatorService.createTeacher(
      "teacher1@example.com",
      teacherUsername,
      "Teacher One"
    );
  });

  it("generates a unique student passcode", async () => {
    const rejoinCodes = [];
    for (let i = 0; i < 10; i++) {
      const rejoinCode = await educatorService.generateStudentRejoinCode();
      console.log("student rejoin code: ", rejoinCode);
      expect(rejoinCodes.includes(rejoinCode)).toBe(false);
      rejoinCodes.push(rejoinCode);
    }
  });

  it("generates a unique authToken (game code) for a classroom", async () => {
    const authTokens = [];
    for (let i = 0; i < 10; i++){
      const authToken = await educatorService.generateAuthToken();
      console.log("classroom code: ", authToken);
      expect(authTokens.includes(authToken)).toBe(false);
      authTokens.push(authToken);
    }
  });

  it("generates a unique educator password", async () => {
    const passwords = [];
    for (let i = 0; i < 10; i++){
      const password = await educatorService.generateTeacherPassword();
      console.log("educator password: ", password);
      expect(passwords.includes(password)).toBe(false);
      passwords.push(password);
    }
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});
