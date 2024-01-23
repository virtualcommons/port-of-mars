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

          <div class="label">
            <input
              type="checkbox"
              class="toggle-input"
              @change="handleToggleChange(date, game.date, $event.target.checked)"
            />
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
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { google, ics } from "calendar-link";
import { TournamentRoundScheduleDate } from "@port-of-mars/shared/types";
import { TournamentAPI } from "@port-of-mars/client/api/tournament/request";

interface LaunchTimes {
  [date: string]: Array<
    TournamentRoundScheduleDate & {
      date: Date;
      googleInviteURL: string;
      icsInviteURL: string;
    }
  >;
}

@Component({})
export default class Schedule extends Vue {
  @Prop({ default: "schedule-header" }) scheduleId!: string;
  @Prop() schedule!: Array<TournamentRoundScheduleDate>;

  @Inject() api!: TournamentAPI;

  static readonly SITE_URL = "https://portofmars.asu.edu";

  get launchTimes() {
    return this.groupLaunchTimesByDate(this.schedule);
  }

  groupLaunchTimesByDate(schedule: Array<TournamentRoundScheduleDate>): LaunchTimes {
    // returns an object with date strings mapped to individual scheduled dates with invite links
    const grouped: LaunchTimes = {};
    for (const scheduleDate of schedule) {
      const launchDate = new Date(scheduleDate.timestamp);
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
        ...scheduleDate,
        date: launchDate,
        googleInviteURL,
        icsInviteURL,
      });
    }
    return grouped;
  }

  // Handle toggle switch change event
  handleToggleChange(date: string, gameDate: Date, isChecked: boolean) {
    if (isChecked) {
      // Add the email to the distribution list corresponding to the date
      this.api.addSignup(); // FIXME: get tournamentRoundDateId on schedule
    } else {
      // Remove the email from the distribution list
      this.api.removeSignup(); // FIXME: get tournamentRoundDateId on schedule
    }
    // Update the toggle state
    this.toggleStates[date] = isChecked;
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
<style lang="scss" scoped>
.switch.square label .lever {
  width: 54px;
  height: 34px;
  border-radius: 0px;
}
.switch.square label .lever:after {
  width: 26px;
  height: 26px;
  border-radius: 0px;
  left: 4px;
  top: 4px;
}

.toggle-input {
  position: relative;
  appearance: none;
  width: 45px; /* Adjust the width as needed */
  height: 25px; /* Adjust the height as needed */
  background-color: #a49ca6; /* Background color when the toggle is off */
  border-radius: 2px; /* Square corners */
  cursor: pointer;
  outline: none;
}

.toggle-input:checked {
  background-color: rgb(95, 141, 75); /* Background color when the toggle is on */
}

.toggle-input::before {
  content: "";
  position: absolute;
  width: 20px; /* Width of the toggle button */
  height: 20px; /* Height of the toggle button */
  background-color: #fff; /* Color of the toggle button */
  border-radius: 5%; /* Make it a rounded square*/
  top: 3px; /* Adjust the vertical position */
  left: 3px; /* Adjust the horizontal position */
  transition: 0.3s; /* Transition for smooth animation */
}

.toggle-input:checked::before {
  transform: translateX(20px); /* Move the toggle button to the right when checked */
}
</style>
