<template>
  <div class="mx-4">
    <h3 :id="scheduleId">Schedule</h3>
    <b-list-group horizontal="lg" class="p-1 d-flex justify-content-center">
      <b-list-group-item
        class="p-1 text-center"
        v-for="game in upcomingGames"
        :key="game.launchTime"
        variant="dark"
      >
        <div class='launch-date'>
        {{ game.launchDate }}
        <br/>
        <span class='launch-time'>{{ game.launchTime }}</span>
        </div>
        <b-button-group>
          <a
            class="btn btn-primary"
            :href="googleInviteLink(game.addToCalendar)"
            title="add to Google Calendar"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
          </a>
          <a
            class="btn btn-info"
            :href="icsInviteLink(game.addToCalendar)"
            title="download as ics"
            target="_blank"
          >
            <font-awesome-icon
              :icon="['fas', 'calendar-plus']"
            ></font-awesome-icon>
          </a>
        </b-button-group>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { google, ics } from "calendar-link";

@Component({})
export default class Schedule extends Vue {
  @Prop({default: "schedule"})
  scheduleId!: string;

  @Prop()
  schedule!: Array<number>;

  @Prop()
  roundNumber!: number;

  readonly SITE_URL = "https://portofmars.asu.edu";

  get upcomingGames() {
    return this.schedule.map((gameTime) => {
      const scheduledDate = new Date(gameTime);
      return {
        launchDate: scheduledDate.toLocaleDateString('en-US'),
        launchTime: scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false, timeZoneName: 'short'}),
        addToCalendar: {
          title: `Port of Mars Round ${this.roundNumber}`,
          location: this.SITE_URL,
          start: scheduledDate,
          duration: [1, "hour"],
          description: this.calendarDescription,
        },
      };
    });
  }

  get calendarDescription() {
    return `Register and complete all Port of Mars Mission Control onboarding tasks at ${this.SITE_URL}. You must complete onboarding before you can participate in Round ${this.roundNumber} of the Mars Madness tournament.`;
  }

  googleInviteLink(invite: {
    title: string;
    location: string;
    start: Date;
    end: Date;
    details: string;
  }) {
    return google(invite);
  }

  icsInviteLink(invite: {
    title: string;
    location: string;
    start: Date;
    end: Date;
    details: string;
  }) {
    return ics(invite);
  }
}
</script>
<style scoped>
.launch-date {
  font-size: 1.2rem;
  font-weight: bolder;
  line-height: 0.9;
}

.launch-time {
  font-size: 1rem;
}
</style>
