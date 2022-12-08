<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="h-100 p-3">
      <b-row class="h-100 m-0">
        <b-col cols="9" class="mh-100 p-2">
          <h4 class="header-nowrap">Reported Chat Messages</h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header
              class="h-100 m-0"
              style="max-height: none;"
              :fields="reportFields"
              :items="reports"
              sort-by="dateCreated"
              :sort-desc="true"
            >
              <template #cell(dateCreated)>
                <!-- sort-by column, dont render -->
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
                <b-button-group style="float: right" size="sm">
                  <b-button v-if="!data.item.resolved"
                    variant="success"
                    @click="submitResolution(data.item.id, true, data.item.username, false)"
                  >Resolve</b-button>
                  <b-button v-else
                    variant="warning"
                    @click="submitResolution(data.item.id, false, data.item.username, false)"
                  >Unresolve</b-button>
                  <b-button
                    variant="danger"
                    v-b-modal="getModalId(data.item.id)"
                  >Ban</b-button>
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
        </b-col>
        <b-col cols="3" class="mh-100 p-2">
          <h4 class="header-nowrap">Banned Users</h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header
              class="h-100 m-0"
              style="max-height: none;"
              :fields="bannedUserFields"
              :items="bannedUsers"
            >
              <template #cell(username)="data">
                {{ data.item.username }}
              </template>
              <template #cell(action)="data">
                <b-button size="sm"
                  style="float: right"
                  variant="success"
                  @click="unbanUser(data.item.username)"
                >Unban</b-button>
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </div>
    
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ChatReportData } from "@port-of-mars/shared/types";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";

@Component({
  components: {
    ChatMessage
  }
})
export default class Reports extends Vue {
  api!: AdminAPI;
  reports: Array<ChatReportData> = [];
  reportFields = [
    { key: "status", label: "Status" },
    { key: "dateCreated", label: "", sortable: true },
    { key: "time", label: "Time" },
    { key: "roomId", label: "Room" },
    { key: "user", label: "User" },
    { key: "message", label: "Message" },
    { key: "action", label: "Action" }
  ];
  bannedUsers: Array<string> = [];
  bannedUserFields = [
    { key: "username", label: "Username" },
    { key: "action", label: "Action" }
  ];
  pollingIntervalId = 0;

  async created() {
    this.api = new AdminAPI(this.$tstore, this.$ajax);
    await this.initialize();
  }

  beforeDestroy() {
    if (this.pollingIntervalId != 0) {
      window.clearInterval(this.pollingIntervalId);
    }
  }

  async initialize() {
    await this.fetchChatReports();
    await this.fetchBannedUsers();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchChatReports();
      await this.fetchBannedUsers();
    }, 30 * 1000);
  }

  async fetchChatReports() {
    const reports = await this.api.getChatReports();
    Vue.set(this, "reports", reports);
  }

  async fetchBannedUsers() {
    const bannedUsers = await this.api.getBannedUsers();
    Vue.set(this, "bannedUsers", bannedUsers);
  }

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

  async submitResolution(reportId: number, resolved: boolean, username: string, ban: boolean) {
    await this.api.submitReportResolution({ reportId, resolved, username, ban }, () => {
      this.$bvModal.hide(this.getModalId(reportId));
      this.fetchChatReports();
      this.fetchBannedUsers();
    });
  }

  async unbanUser(username: string) {
    await this.api.unbanUser(username, () => {
      this.fetchBannedUsers();
      this.fetchChatReports();
    });
  }
}
</script>

<style lang="scss" scoped>
.h-100-header {
  height: calc(100% - 2rem);
}

.header-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>