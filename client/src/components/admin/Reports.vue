<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="content-container my-4 ml-2">
      <b-table dark sticky-header
        class="m-0 custom-table"
        :fields="fields"
        :items="reports"
        sort-by="dateCreated"
        :sort-desc="true"
      >
        <template #cell(dateCreated)>
          <!-- sort-by column, dont render -->
          <!-- FIXME: SEE IF THIS IS NEEDED
          
          
          
          
          
          
          
          
          
           -->
        </template>
        <template #cell(status)="data">
          <b-badge v-if="data.item.resolved" variant="success">Resolved</b-badge>
          <b-badge v-else variant="warning">Unresolved</b-badge>
        </template>
        <template #cell(time)="data">
          {{ formatTime(data.item.dateCreated) }}
        </template>
        <template #cell(user)="data">
          {{ data.item.username }}
          <span v-if="data.item.isBanned" class="text-danger"> [banned]</span>
        </template>
        <template #cell(message)="data">
          {{ data.item.message.message }}
        </template>
        <template #cell(action)="data">
          <b-button-group size="sm">
            <b-button v-if="!data.item.resolved"
              variant="success"
              v-b-tooltip.hover.top="'Mark as resolved without banning the user'"
              @click="submitResolution(data.item.id, true, data.item.username, false)"
            >Mark Resolved</b-button>
            <b-button v-else
              variant="warning"
              v-b-tooltip.hover.top="'Mark as unresolved'"
              @click="submitResolution(data.item.id, false, data.item.username, false)"
            >Mark Unresolved</b-button>
            <b-button
              variant="danger"
              v-b-tooltip.hover.top="'Ban user from playing Port of Mars'"
              v-b-modal="getModalId(data.item.id)"
            >Ban User</b-button>
            <b-modal
                :id="getModalId(data.item.id)"
                title="Are you sure?" 
                centered
                no-stacking
                header-bg-variant="primary"
                header-border-variant="primary"
                body-bg-variant="dark"
                footer-border-variant="dark"
                footer-bg-variant="dark"
              >
              <p class="my-4">
                Ban user <span class="text-danger">{{ data.item.username }}</span> from playing Port of Mars?
              </p>
              <template #modal-footer="{ cancel }">
                <b-button variant="secondary" @click="cancel">Cancel</b-button>
                <b-button
                  variant="danger"
                  @click="submitResolution(data.item.id, true, data.item.username, true);"
                >Ban User</b-button>
              </template>
            </b-modal>
          </b-button-group>
        </template>
      </b-table>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ChatReportData } from "@port-of-mars/shared/types";
import { url } from "@port-of-mars/client/util";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";

@Component({
  components: {
    ChatMessage
  }
})
export default class Reports extends Vue {
  @Prop()
  reports!: Array<ChatReportData>;

  fields = [
    { key: "status", label: "Status" },
    { key: "dateCreated", label: "", sortable: true },
    { key: "time", label: "Time" },
    { key: "roomId", label: "Room" },
    { key: "user", label: "User" },
    { key: "message", label: "Message" },
    { key: "action", label: "Action" }
  ];

  formatTime(date: Date) {
    const time = new Date(date);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days} day${(days === 1) ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${(hours === 1) ? "" : "s"} ago`;
    } else {
      return "just now";
    }
  }

  getModalId(reportId: number) {
    return `confirm-modal-${reportId}`;
  }

  get submitResolutionUrl() {
    return url("/admin/resolve-report");
  }

  async submitResolution(reportId: number, resolved: boolean, username: string, ban: boolean) {
    await this.$ajax.post(
      this.submitResolutionUrl,
      (response) => {
        if (response.status === 200) {
          this.$bvModal.hide(this.getModalId(reportId));
          // TODO: refresh data
        }
      },
      { reportId, resolved, username, ban }
    );
  }
}
</script>

<style lang="scss" scoped>
.custom-table {
  max-height: calc(100vh - 145px);
  background-color: $dark;
}
</style>