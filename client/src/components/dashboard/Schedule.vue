<template>
  <div class="mx-5">
    <h4 v-if="schedule.length > 0" :id="scheduleId">Schedule</h4>
    <h3 v-else>There are currently no scheduled games.</h3>
    <b-list-group horizontal="lg" class="p-1">
      <b-list-group-item
        class="p-1 text-center"
        v-for="game in upcomingGames"
        :key="game.launchTime"
        variant="dark"
      >
        <span class="launch-time">{{ game.launchTime }}</span>
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
            <font-awesome-icon :icon="['fas', 'calendar-plus']"></font-awesome-icon>
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
  @Prop({ default: "schedule" })
  scheduleId!: string;

  @Prop()
  schedule!: Array<number>;

  @Prop()
  roundNumber!: number;

  readonly SITE_URL = "https://portofmars.asu.edu";

  get upcomingGames() {
    // FIXME: extract duplicate logic here + dashboard into schedule component
    return this.schedule.map(gameTime => {
      const scheduledDate = new Date(gameTime);
      return {
        launchTime: scheduledDate.toLocaleString(),
        addToCalendar: {
          title: `Port of Mars Round ${this.roundNumber}`,
          location: this.SITE_URL,
          start: scheduledDate,
          duration: [1, "hour"],
          description: this.calendarDescription
        }
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
h4 {
  color: white;
}

.launch-time {
  font-size: 1.2rem;
  font-weight: bolder;
}
</style>
