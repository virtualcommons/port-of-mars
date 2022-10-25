import { User, Player, ScheduledGameDate } from '@port-of-mars/server/entity';
import { MoreThan, SelectQueryBuilder } from 'typeorm';
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
    date: Date, minutesOpenBefore: number, minutesOpenAfter: number, autoCreated: boolean = false
  ): Promise<ScheduledGameDate|null> {
    const scheduledDates = await this.getScheduledDates();
    // don't allow games to be scheduled at the same time
    if (scheduledDates.find(e => e.date.getTime() === date.getTime())) {
      return null;
    }
    const lobbyCloseDate = new Date(date.getTime() + (minutesOpenAfter * 60 * 1000));
    const repository = this.em.getRepository(ScheduledGameDate);
    const scheduledDate = repository.create({
      date,
      minutesOpenBefore,
      minutesOpenAfter,
      lobbyCloseDate,
      autoCreated
    });
    return await repository.save(scheduledDate);
  }

  /**
   * Schedule games for the given time period at the given interval
   * if not already scheduled
   * @param {number} [interval=3] - hours between games, must be a divisor of 24
   * @param {number} [days=1] - days from current date to schedule games until
   */
  async scheduleGames(interval: number = 3, days: number = 1): Promise<Array<DateWindow>> {
    // FIXME: re-implement this with luxon or a more clever algo for better clarity
    const minutesOpenBefore = settings.lobby.lobbyOpenBeforeOffset;
    const minutesOpenAfter = settings.lobby.lobbyOpenAfterOffset;
    const period = days * 24;
    const scheduled = await this.getScheduledDates(true);
    const numGamesToSchedule = Math.trunc(period / interval);
    logger.debug("%d games to schedule", numGamesToSchedule);
    logger.debug("%d already scheduled", scheduled.length);
    if (scheduled.length >= numGamesToSchedule) {
      // games are already scheduled for this period
      return [];
    } else {
      const currentHour = new Date().getUTCHours();
      // get the next time to schedule based off of 00:00 UTC
      const nextHourToSchedule = (interval * Math.ceil((currentHour + 1) / interval)) % period;
      for (var i = scheduled.length; i < numGamesToSchedule; i++) {
        // get the next hour to schedule as a date today
        const nextDate = new Date();
        // rollover to next day if we are scheduling then
        if (nextHourToSchedule === 0) nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        nextDate.setUTCHours(nextHourToSchedule, 0, 0, 0);
        const hourOffset = i * interval;
        const time = nextDate.getTime() + hourOffset * 60 * 60 * 1000;
        const scheduledDate = await this.createScheduledGameDate(new Date(time), minutesOpenBefore, minutesOpenAfter, true);
        if (scheduledDate) {
          logger.debug("scheduling a game for %s", new Date(time).toUTCString());
        }
        else {
          logger.debug("duplicate date: %s, nothing scheduled", new Date(time).toUTCString());
        }
      }
    }
    return this.getScheduledDates();
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
    // if (settings.lobby.devMode) {
    //   return true;
    // }
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