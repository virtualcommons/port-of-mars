import { User, Player, ScheduledGameDate } from '@port-of-mars/server/entity';
import { MoreThan, SelectQueryBuilder } from 'typeorm';
import { settings, getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";

import * as _ from 'lodash';

const logger = getLogger(__filename);
// FIXME: should probably be pulled from settings
// 5 minutes grace period for whether the scheduled game is joinable
const LOBBY_OPEN_AFTER_OFFSET = 5 * 60 * 1000;
const LOBBY_OPEN_BEFORE_OFFSET = 10 * 60 * 1000;

export class ScheduleService extends BaseService {

  /**
   * Creates a new scheduled game date
   * Returns the date scheduled
   */
  async createScheduledGameDate(date: Date, autoCreated: boolean = false): Promise<ScheduledGameDate> {
    const repository = this.em.getRepository(ScheduledGameDate);
    const scheduledDate = repository.create({ date, autoCreated });
    return await repository.save(scheduledDate);
  }

  /**
   * Schedule games for the given time period at the given interval
   * if not already scheduled
   * @param {number} [interval=3] - hours between games, must be a divisor of 24
   * @param {number} [days=1] - days from current date to schedule games until
   */
  async scheduleGames(interval: number = 3, days: number = 1): Promise<Array<Date>> {
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
        await this.createScheduledGameDate(new Date(time), true);
        logger.debug("scheduling a game for %s", new Date(time).toUTCString());
      }
    }
    return this.getScheduledDates();
  }

  /**
   * Returns upcoming scheduled dates
   */
  async getScheduledDates(onlyAutoCreated: boolean = false): Promise<Array<Date>> {
    // scheduled dates within 5 minutes of the scheduled tournament date should
    // still be available
    const offsetTime = new Date().getTime() - LOBBY_OPEN_AFTER_OFFSET;
    let schedule = await this.em.getRepository(ScheduledGameDate).find({
      select: ['date', 'autoCreated'],
      where: { date: MoreThan(new Date(offsetTime)) },
      order: { date: 'ASC' }
    });
    if (onlyAutoCreated) {
      schedule = schedule.filter(s => s.autoCreated);
    }
    const scheduledDates = schedule.map(s => s.date);
    return scheduledDates;
  }

  /**
   * Returns true if there is a scheduled game within a specific time window of now.
   * Currently set to open 10 mins before the scheduled game, and 5 minutes after
   * the scheduled game (i.e., 15 minute window).
   */
  async isLobbyOpen(gameDates?: Array<Date>): Promise<boolean> {
    // FIXME: use settings for the offsets
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
    for (const date of gameDates) {
      const gameTime = date.getTime();
      const openDate = new Date(gameTime - LOBBY_OPEN_BEFORE_OFFSET);
      const closeDate = new Date(gameTime + LOBBY_OPEN_AFTER_OFFSET);
      if (now > openDate && now < closeDate) {
        return true;
      }
    }
    return false;
  }

}