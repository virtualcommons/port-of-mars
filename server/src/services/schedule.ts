import { User, Player, Schedule } from '@port-of-mars/server/entity';
import { MoreThan, SelectQueryBuilder } from 'typeorm';
import { settings, getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";

import * as _ from 'lodash';

const logger = getLogger(__filename);
// FIXME: should probably be pulled from settings
// 5 minutes grace period for whether the scheduled game is joinable
const LOBBY_OPEN_AFTER_OFFSET = 5 * 60 * 1000;

export class ScheduleService extends BaseService {

  async createScheduledGameDate(date: Date): Promise<Schedule> {
    /**
     * Creates a new scheduled game date
     * Returns the date scheduled
     */
    const repository = this.em.getRepository(Schedule);
    const scheduledDate = repository.create({ date });
    return await repository.save(scheduledDate);
  }

  async scheduleGames(interval: number = 3, days: number = 1): Promise<Array<Date>> {
    /**
     * Schedule games for the given time period at the given interval
     * if not already scheduled
     * @param {number} [interval=3] - hours between games, must be a divisor of 24
     * @param {number} [days=1] - days from current date to schedule games until
     */
    const period = days * 24;
    const scheduled = await this.getScheduledDates();
    const numGamesToSchedule = Math.trunc(period / interval);
    logger.debug("%d games to schedule", numGamesToSchedule);
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
        const hours = ((i * interval) + nextHourToSchedule);
        const time = nextDate.getTime() + hours * 60 * 60 * 1000;
        await this.createScheduledGameDate(new Date(time));
        logger.debug("scheduling a game for %s", new Date(time).toUTCString());
      }
    }
    return this.getScheduledDates();
  }

  async getScheduledDates(): Promise<Array<Date>> {
    /**
     * Returns upcoming scheduled dates
     */
    // scheduled dates within 5 minutes of the scheduled tournament date should
    // still be available
    const offsetTime = new Date().getTime() - LOBBY_OPEN_AFTER_OFFSET;
    const schedule = await this.em.getRepository(Schedule).find({
      select: ['date'],
      where: { date: MoreThan(new Date(offsetTime)) },
      order: { date: 'ASC' }
    });
    return schedule.map(s => s.date);
  }

}