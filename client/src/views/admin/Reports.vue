<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="h-100 p-3">
      <b-row class="h-100 m-0">
        <b-col cols="8" class="mh-100 p-2">
          <h4 class="header-nowrap">Reported Chat Messages</h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header sort-icon-left
              class="h-100 m-0"
              style="max-height: none;"
              :fields="reportFields"
              :items="reports"
              sort-by="dateCreated"
              :sort-desc="true"
            >
              <template #cell(dateCreated)="data">
                {{ formatPastTime(data.item.dateCreated) }}
              </template>
              <template #cell(user)="data">
                {{ data.item.username }}
                <span v-if="data.item.isMuted" class="text-warning"> [muted]</span>
                <span v-if="data.item.isBanned" class="text-danger"> [banned]</span>
                <span v-else-if="data.item.muteStrikes" class="text-light"> 
                  ({{ data.item.muteStrikes }} {{ data.item.muteStrikes === 1 ? 'strike' : 'strikes' }})
                </span>
              </template>
              <template #cell(message)="data">
                {{ data.item.message.message }}
              </template>
              <template #cell(action)="data">
                <b-button-group style="float: right">
                  <ConfirmationModalButton
                    variant="secondary"
                    action="Hide"
                    :modalId="getModalId('none', data.item.id)"
                    @confirmed="takeModerationAction({ reportId: data.item.id, action: 'none', username: data.item.username })"
                  >
                    <template>
                      Resolve this report of user 
                      <span class="text-danger">{{ data.item.username }}</span> 
                      without taking any action?
                    </template>
                  </ConfirmationModalButton>
                  <ConfirmationModalButton
                    variant="warning"
                    action="Mute"
                    :modalId="getModalId('mute', data.item.id)"
                    @confirmed="takeModerationAction({ reportId: data.item.id, action: 'mute', username: data.item.username })"
                  >
                    <template>
                      Temporarily mute user 
                      <span class="text-danger">{{ data.item.username }}</span>?
                      This will prevent them from using the in-game chat.
                    </template>
                  </ConfirmationModalButton>
                  <ConfirmationModalButton
                    variant="danger"
                    action="Ban"
                    :modalId="getModalId('ban', data.item.id)"
                    @confirmed="takeModerationAction({ reportId: data.item.id, action: 'ban', username: data.item.username })"
                  >
                    <template>
                      Ban user 
                      <span class="text-danger">{{ data.item.username }}</span> 
                      from playing Port of Mars?
                    </template>
                  </ConfirmationModalButton>
                </b-button-group>
              </template>
            </b-table>
          </div>
        </b-col>
        <b-col cols="4" class="mh-100 p-2">
          <h4 class="header-nowrap">Actions Log</h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header sort-icon-left
              class="h-100 m-0"
              style="max-height: none;"
              :fields="moderationActionFields"
              :items="moderationActions"
            >
              <template #cell(dateMuteExpires)="data">
                <span v-if="data.item.dateMuteExpires">
                  <span v-if="new Date(data.item.dateMuteExpires) < new Date()" class="text-danger">expired</span>
                  <span v-else>{{ formatFutureTime(data.item.dateMuteExpires) }}</span>
                </span>
              </template>
              <template #cell(undo)="data">
                <b-button size="sm"
                  variant="success"
                  @click="undoModerationAction(data.item.id, data.item.username)"
                >
                Undo</b-button>
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  ChatReportData,
  ModerationActionType,
  ModerationActionData,
  ModerationActionClientData,
} from "@port-of-mars/shared/types";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";
import ConfirmationModalButton from "@port-of-mars/client/components/admin/ConfirmationModalButton.vue";

@Component({
  components: {
    ChatMessage,
    ConfirmationModalButton
  }
})
export default class Reports extends Vue {
  api!: AdminAPI;
  reports: Array<ChatReportData> = [];
  reportFields = [
    { key: "dateCreated", label: "Time", sortable: true },
    { key: "roomId", label: "Room" },
    { key: "user", label: "User" },
    { key: "message", label: "Message" },
    { key: "action", label: "Action" }
  ];
  moderationActions: Array<ModerationActionClientData> = [];
  moderationActionFields = [
    { key: "adminUsername", label: "Admin" },
    { key: "username", label: "User" },
    { key: "action", label: "Action", sortable: true },
    { key: "dateMuteExpires", label: "Expires" },
    { key: "undo", label: "" }
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
    await this.fetchModerationActions();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchChatReports();
      await this.fetchModerationActions();
    }, 30 * 1000);
  }

  async fetchChatReports() {
    const reports = await this.api.getUnresolvedChatReports();
    Vue.set(this, "reports", reports);
  }

  async fetchModerationActions() {
    const moderationActions = await this.api.getModerationActions();
    Vue.set(this, "moderationActions", moderationActions);
  }

  formatPastTime(date: Date) {
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

  formatFutureTime(date: Date) {
    const time = new Date(date);
    const now = new Date();
    const diff = time.getTime() - now.getTime();
    const hours = Math.ceil(diff / 1000 / 60 / 60);
    const days = Math.ceil(hours / 24);
    if (days > 0) {
      return `in ${days} day${(days === 1) ? "" : "s"}`;
    } else if (hours > 0) {
      return `in ${hours} hour${(hours === 1) ? "" : "s"}`;
    } else {
      return "soon";
    }
  }

  getModalId(action: string, reportId: number) {
    return `confirm-${action}-modal-${reportId}`;
  }

  async takeModerationAction(data: { reportId: number, username: string, action: ModerationActionType, daysMuted?: number }) {
    const moderationActionData: ModerationActionData = {
      ...data,
      adminUsername: this.$tstore.state.user.username
    };
    await this.api.takeModerationAction(moderationActionData, () => {
      this.$bvModal.hide(this.getModalId(data.action, data.reportId));
      this.fetchChatReports();
      this.fetchModerationActions();
    });
  }

  async undoModerationAction(moderationActionId: number, username: string) {
    await this.api.undoModerationAction({ moderationActionId, username }, () => {
      this.fetchModerationActions();
      this.fetchChatReports();
    });
  }
}
</script>

<style lang="scss" scoped>
</style>