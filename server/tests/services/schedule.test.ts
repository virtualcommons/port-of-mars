import {Connection, EntityManager, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {initTransaction, rollbackTransaction} from "./common";

describe("game scheduler", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let services: ServiceProvider;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    services = new ServiceProvider(qr.manager);
    jest.useFakeTimers();
    jest.setSystemTime(new Date("January 1, 2022 03:24:00 UTC"));
  });

  it("schedules dates for the correct time", async () => {
    // schedule games every 3 hours for 1 day out
    await services.schedule.scheduleGames(3, 1);
    const dates = await services.schedule.getScheduledDates();
    expect(dates[0].date.getTime()).toEqual(new Date("January 1, 2022 06:00:00 UTC").getTime());
    expect(dates[1].date.getTime()).toEqual(new Date("January 1, 2022 09:00:00 UTC").getTime());
    expect(dates[2].date.getTime()).toEqual(new Date("January 1, 2022 12:00:00 UTC").getTime());
    expect(dates[3].date.getTime()).toEqual(new Date("January 1, 2022 15:00:00 UTC").getTime());
    expect(dates[4].date.getTime()).toEqual(new Date("January 1, 2022 18:00:00 UTC").getTime());
    expect(dates[5].date.getTime()).toEqual(new Date("January 1, 2022 21:00:00 UTC").getTime());
    expect(dates[6].date.getTime()).toEqual(new Date("January 2, 2022 00:00:00 UTC").getTime());
    expect(dates[7].date.getTime()).toEqual(new Date("January 2, 2022 03:00:00 UTC").getTime());
  });

  it("does not duplicate dates", async () => {
    await services.schedule.scheduleGames(3, 1);
    const dates = await services.schedule.getScheduledDates();
    expect(dates.length).toBe(8);
    await services.schedule.createScheduledGameDate({
      date: new Date("January 1, 2022 06:00:00 UTC"),
      minutesOpenBefore: 15,
      minutesOpenAfter: 15
    });
    expect(dates.length).toBe(8);
  });

  it("distinguishes between auto-scheduled and manually created dates", async () => {
    await services.schedule.scheduleGames(3, 1);
    await services.schedule.createScheduledGameDate({
      date: new Date("January 1, 2022 04:00:00 UTC"),
      minutesOpenBefore: 60,
      minutesOpenAfter: 60
    });
    let dates = await services.schedule.getScheduledDates(false);
    expect(dates.length).toBe(9);
    dates = await services.schedule.getScheduledDates(true);
    expect(dates.length).toBe(8);
  });

  it("opens the lobby when within a date window", async () => {
    await services.schedule.createScheduledGameDate({
      date: new Date("January 1, 2022 04:00:00 UTC"),
      minutesOpenBefore: 60,
      minutesOpenAfter: 60
    });
    expect(await services.schedule.isLobbyOpen()).toBe(true);
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});
