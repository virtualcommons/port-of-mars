<template>
  <div>
    <b-list-group class="p-1">
      <template v-for="(times, date) in launchTimes">
        <b-list-group-item class="text-center bg-primary border-0 my-1" :key="date">
          <b>{{ date }}</b>
        </b-list-group-item>
        <b-list-group-item
          class="p-3 text-center bg-dark border-0 my-1 d-flex justify-content-between"
          v-for="game in times"
          :key="game.date.getTime()"
        >
          <div class="launch-date">
            <b>{{ formatTime(game.date) }}</b>
          </div>
          <b-button-group>
            <a
              class="btn btn-secondary py-0"
              :href="game.googleInviteURL"
              title="add to Google Calendar"
              target="_blank"
            >
              <b-icon-google scale=".8"></b-icon-google>
            </a>
            <a
              class="btn btn-primary py-0"
              :href="game.icsInviteURL"
              title="download as ics"
              target="_blank"
            >
              <b-icon-calendar-plus-fill scale=".8"></b-icon-calendar-plus-fill>
            </a>
          </b-button-group>
        </b-list-group-item>
      </template>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { google, ics } from "calendar-link";

interface LaunchTimes {
  [date: string]: {
    date: Date;
    googleInviteURL: string;
    icsInviteURL: string;
  }[];
}

@Component({})
export default class Schedule extends Vue {
  @Prop({ default: "schedule-header" })
  scheduleId!: string;

  @Prop()
  schedule!: Array<number>;

  static readonly SITE_URL = "https://portofmars.asu.edu";

  get launchTimes() {
    return this.groupLaunchTimesByDate(this.schedule);
  }

  groupLaunchTimesByDate(launchTimes: number[]) {
    // returns an object with date strings mapped to individual launch times and invite links
    // could use a Map<string, object> also
    const grouped: LaunchTimes = {};
    for (const time of launchTimes) {
      const launchDate = new Date(time);
      const dateStr = launchDate.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      const calendarEvent = this.buildCalendarEvent(launchDate);
      const googleInviteURL = google(calendarEvent);
      const icsInviteURL = ics(calendarEvent);
      grouped[dateStr].push({
        date: new Date(time),
        googleInviteURL,
        icsInviteURL,
      });
    }
    return grouped;
  }

  get calendarEventDescription() {
    return (
      `Register and complete all Port of Mars onboarding tasks at ${Schedule.SITE_URL} ASAP. \n\n` +
      `Sign in and join the tournament lobby up to 10 minutes before launch time. \n\n` +
      `Games will automatically start when at least 5 players are connected to the game lobby.`
    );
  }

  buildCalendarEvent(start: Date) {
    return {
      title: `Port of Mars Mars Madness Launch`,
      location: Schedule.SITE_URL,
      start,
      description: this.calendarEventDescription,
      duration: [1, "hour"],
    };
  }

  formatTime(date: Date) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
  }
}
</script>
<style lang="scss" scoped></style>
