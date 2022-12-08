<template>
  <b-container fluid class="h-100 w-100 m-0 p-0">
    <b-row
      class="w-100 h-100 m-auto scroll-to-recent"
      style="overflow-y: auto; overflow-x: hidden;"
    >
      <b-row class="w-100 justify-content-center" align-content="end">
        <!-- if there is no history to display -->
        <p v-if="logs.length === 0" class="m-5" style="color: rgba(241, 224, 197, 0.25)">
          Nothing to report.
        </p>
        <!-- log message -->
        <b-row
          v-for="log in orderedLogs"
          :style="{ backgroundColor: categoryColorMap.get(log.category) }"
          :key="log.id"
          class="h-auto w-100 my-1 flex-column justify-content-start"
          style="background-color: var(--marslog-orange)"
        >
          <b-col align-self="end">
            <!-- category (e.g. System Health, Event, etc.) -->
            <p
              class="mb-0 mx-2 mt-2 text-uppercase"
              style="color: var(--light-accent); font-weight: bold"
            >
              {{ log.category }}
            </p>
            <!-- message -->
            <p class="mx-2" style="word-wrap: break-word">{{ log.content }}</p>
            <b-row class="px-2">
              <!-- timestamp and round -->
              <b-col cols="auto" class="mr-auto">
                <p>[ {{ logTime(log.timestamp) }} ]</p>
              </b-col>
              <b-col cols="auto">
                <p>ROUND {{ log.round }}</p>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import _ from "lodash";

@Component({
  components: {}
})
export default class MarsLog extends Vue {
  @Prop({ default: false })
  orderByMostRecent!: boolean;

  @Prop()
  logs!: any;

  updated() {
    const elem = this.$el.querySelector(".scroll-to-recent");
    elem!.scrollTop = elem!.scrollHeight;
  }

  get orderedLogs() {
    console.log(this.logs.length);
    if (this.orderByMostRecent) {
      return _.orderBy(this.logs, ["timestamp", "id"], ["desc", "desc"]);
    }
    return this.logs;
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
  }

  logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
}
</script>
