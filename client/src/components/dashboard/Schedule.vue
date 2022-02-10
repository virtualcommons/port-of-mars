<template>
  <b-table
    sticky-header="20rem"
    :items="upcomingGames"
    dark
    striped
    bordered
    show-empty
  >
    <template #empty>
      <b-alert class="mt-2 lead" variant="info" show>
        No upcoming games on the schedule at this time. Please check again
        later!
      </b-alert>
    </template>
    <template v-slot:cell(addToCalendar)="data">
      <div>
        <b-button-group>
          <a
            class="btn btn-info"
            :href="googleInviteLink(data.item.addToCalendar)"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
            add to google calendar
          </a>
          <a
            class="btn btn-info"
            :href="icsInviteLink(data.item.addToCalendar)"
            target="_blank"
          >
            <font-awesome-icon
              :icon="['fas', 'calendar-plus']"
            ></font-awesome-icon>
            download ics
          </a>
        </b-button-group>
      </div>
    </template>
  </b-table>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { google, ics } from "calendar-link";

@Component({})
export default class Schedule extends Vue {
  @Prop()
  schedule!: Array<number>;

  @Prop()
  roundNumber!: number;

  get upcomingGames() {
    const currentRoundNumber = this.roundNumber;
    // FIXME: extract duplicate logic here + dashboard into schedule component
    return this.schedule.map((gameTime) => {
      const scheduledDate = new Date(gameTime);
      return {
        launchTime: scheduledDate.toLocaleString(),
        addToCalendar: {
          title: `Port of Mars Round ${currentRoundNumber}`,
          location: "https://portofmars.asu.edu/",
          start: scheduledDate,
          duration: [1, "hour"],
          description: `Participate in Round ${currentRoundNumber} of the Mars Madness tournament at https://portofmars.asu.edu/ - the lobby stays open for a 30 minute window after the scheduled time.`,
        },
      };
    });
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