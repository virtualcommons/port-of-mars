<template>
  <div>
    <b-list-group class="p-1">
      <template v-for="(launchTimes, date) in groupedLaunchTimes">
        <b-list-group-item class="text-center bg-primary border-0 my-1" :key="date">
          <b>{{ date }}</b>
        </b-list-group-item>
        <b-list-group-item
          class="p-0 bg-dark border-0 my-1 d-flex flex-column"
          v-for="launchTime in launchTimes"
          :key="launchTime.date.getTime()"
        >
          <div class="p-3 text-center d-flex justify-content-between align-items-center">
            <div class="launch-date">
              <b>{{ formatTime(launchTime.date) }}</b>
            </div>
            <div class="d-flex align-items-between">
              <div v-if="!invite.hasParticipated" class="d-flex align-items-center mr-3">
                <label class="mb-0 mr-2" for="signup-toggle">
                  <small v-if="launchTime.isSignedUp" class="text-success">Signed up</small>
                  <small v-else>Sign up to get notified *</small>
                </label>
                <input
                  id="signup-toggle"
                  v-model="launchTime.isSignedUp"
                  type="checkbox"
                  class="toggle-input"
                  @click="handleSignupClicked(launchTime)"
                />
              </div>
              <b-button-group>
                <a
                  id="add-to-gcal"
                  class="btn btn-dark py-0"
                  :href="launchTime.googleInviteURL"
                  title="add to Google Calendar"
                  target="_blank"
                >
                  <b-icon-google scale=".8"></b-icon-google>
                </a>
                <b-popover target="add-to-gcal" placement="bottom" triggers="hover focus">
                  <template #title></template>
                  add to Google Calendar
                </b-popover>
                <a
                  id="download-ics"
                  class="btn btn-dark py-0"
                  :href="launchTime.icsInviteURL"
                  title="download as ics"
                  target="_blank"
                >
                  <b-icon-calendar-plus-fill scale=".8"></b-icon-calendar-plus-fill>
                </a>
                <b-popover target="download-ics" placement="bottom" triggers="hover focus">
                  <template #title></template>
                  download as .ics
                </b-popover>
              </b-button-group>
            </div>
          </div>
          <div>
            <b-progress
              id="interest-bar"
              :value="launchTime.signupCount + 0.5"
              :max="signupsPopularityThreshold"
              class="bg-dark"
              height="0.5rem"
              :variant="getInterestBarVariant(launchTime.signupCount)"
              title="interest level"
              style="opacity: 0.5"
            ></b-progress>
          </div>
        </b-list-group-item>
      </template>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { google, ics } from "calendar-link";
import {
  TournamentRoundInviteStatus,
  TournamentRoundScheduleDate,
} from "@port-of-mars/shared/types";
import { TournamentAPI } from "@port-of-mars/client/api/tournament/request";

interface LaunchTime extends TournamentRoundScheduleDate {
  date: Date;
  googleInviteURL: string;
  icsInviteURL: string;
}

interface GroupedLaunchTimes {
  [date: string]: Array<LaunchTime>;
}

@Component({})
export default class Schedule extends Vue {
  @Prop({ default: "schedule-header" }) scheduleId!: string;
  @Prop() schedule!: Array<TournamentRoundScheduleDate>;
  @Prop() invite!: TournamentRoundInviteStatus;

  @Inject() readonly api!: TournamentAPI;

  static readonly SITE_URL = "https://portofmars.asu.edu";

  get groupedLaunchTimes() {
    return this.groupLaunchTimesByDate(this.schedule);
  }

  get signupsPopularityThreshold() {
    return this.$store.getters.tournamentStatus.signupsPopularityThreshold;
  }

  getInterestBarVariant(signupCount: number) {
    return signupCount < this.signupsPopularityThreshold / 2 ? "warning" : "success";
  }

  groupLaunchTimesByDate(schedule: Array<TournamentRoundScheduleDate>): GroupedLaunchTimes {
    // returns an object with date strings mapped to individual scheduled dates with invite links
    const grouped: GroupedLaunchTimes = {};
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

  async handleSignupClicked(launchTime: LaunchTime) {
    const tournamentRoundDateId = launchTime.tournamentRoundDateId;
    if (launchTime.isSignedUp) {
      await this.api.removeSignup(tournamentRoundDateId, this.invite.id);
    } else {
      await this.api.addSignup(tournamentRoundDateId, this.invite.id);
    }
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
      duration: [1, "hour"] as any,
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
