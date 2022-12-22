import { User, Player, ScheduledGameDate } from '@port-of-mars/server/entity';
import { MoreThan, SelectQueryBuilder } from 'typeorm';
import { DateTime, Interval } from 'luxon';
import { settings, getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";

import * as _ from 'lodash';

const logger = getLogger(__filename);

interface DateWindow {
  date: Date;
  minutesOpenBefore: number;
  minutesOpenAfter: number;
}

export class ScheduleService extends BaseService {

  /**
   * Creates a new scheduled game date
   * Returns the date scheduled or null if there was a conflict
   */
  async createScheduledGameDate(
    gameDate: DateWindow, autoCreated: boolean = false
  ): Promise<ScheduledGameDate|null> {
    const scheduledDates = await this.getScheduledDates();
    // don't allow games to be scheduled at the same time
    if (scheduledDates.find(e => e.date.getTime() === gameDate.date.getTime())) {
      logger.debug("duplicate date: %s, nothing scheduled", gameDate.date.toUTCString());
      return null;
    }
    const repository = this.em.getRepository(ScheduledGameDate);
    const scheduledDate = repository.create({
      date: gameDate.date,
      minutesOpenBefore: gameDate.minutesOpenBefore,
      minutesOpenAfter: gameDate.minutesOpenAfter,
      autoCreated
    });
    logger.debug("scheduling a game for %s, min before: %d, min after: %d",
      scheduledDate.date.toUTCString(), gameDate.minutesOpenBefore, gameDate.minutesOpenAfter);
    return await repository.save(scheduledDate);
  }

  /**
   * Schedule games for the given time period at the given interval
   * if not already scheduled
   * @param {number} [interval=3] - hours between games, must be a divisor of 24
   * @param {number} [days=1] - days from current date to schedule games until
   */
  async scheduleGames(interval: number = 3, days: number = 1) {
    logger.debug("attempting to schedule games %d days out, every %d hours", days, interval);
    const scheduled = await this.getScheduledDates(true);
    const now = DateTime.fromJSDate(new Date()).toUTC();
    // get the next hour to schedule a date at based off of 00:00 UTC 
    // e.g. (now = 10:30, interval = 3 hours) => 12
    const nextHourToSchedule = interval * Math.ceil((now.hour + 1) / interval);
    const start = now.startOf("day").plus({ hours: nextHourToSchedule });
    // get an array of DateTimes every [interval] hours starting at [start] and
    // ending at [start] + [days]
    const datesToSchedule = Interval.fromDateTimes(start, start.plus({ days: days }))
      .splitBy({ hours: interval })
      .map((e) => e.start); 
    for (const date of datesToSchedule) {
      if (!scheduled.find((e) => e.date.getTime() === date.toMillis())) {
        const scheduledDate = await this.createScheduledGameDate({
          date: date.toJSDate(),
          minutesOpenBefore: settings.lobby.lobbyOpenBeforeOffset,
          minutesOpenAfter: settings.lobby.lobbyOpenAfterOffset,
        }, true);
      }
      else {
        logger.debug("game already scheduled for %s, nothing scheduled", date.toString());
      }
    }
  }

  /**
   * Returns upcoming scheduled dates
   */
  async getScheduledDates(onlyAutoCreated: boolean = false): Promise<Array<DateWindow>> {
    // select scheduled dates for which the lobby has not closed for (lobbyCloseDate > now)
    let schedule = await this.em.getRepository(ScheduledGameDate).find({
      select: ['date', 'minutesOpenBefore', 'minutesOpenAfter', 'lobbyCloseDate', 'autoCreated'],
      where: { lobbyCloseDate: MoreThan(new Date()) },
      order: { date: 'ASC' }
    });
    if (onlyAutoCreated) {
      schedule = schedule.filter(s => s.autoCreated);
    }
    const scheduledGames = schedule.map(s => ({
      date: s.date,
      minutesOpenBefore: s.minutesOpenBefore,
      minutesOpenAfter: s.minutesOpenAfter,
    }));
    return scheduledGames;
  }

  /**
   * Returns true if there is a scheduled game within a specific time window of now
   * given by the offsets of the scheduled game
   */
  async isLobbyOpen(gameDates?: Array<DateWindow>): Promise<boolean> {
    if (!gameDates) {
      gameDates = await this.getScheduledDates();
    }
    if (settings.lobby.devMode) {
      return true;
    }
    if (gameDates.length === 0) {
      return false;
    }
    const now = new Date();
    for (const gameDate of gameDates) {
      const gameTime = gameDate.date.getTime();
      const openDate = new Date(gameTime - (gameDate.minutesOpenBefore * 60 * 1000));
      const closeDate = new Date(gameTime + (gameDate.minutesOpenAfter * 60 * 1000));
      if (now > openDate && now < closeDate) {
        return true;
      }
    }
    return false;
  }

}