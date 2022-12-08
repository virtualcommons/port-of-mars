<template>
  <b-container class="h-100 p-0 m-0 bg" fluid>
    <b-row no-gutters class="h-100 w-100">
      <!-- admin sidebar -->
      <b-nav pills class="sidebar" vertical style="display: block; position: fixed; width: 100%; max-width:145px;">
        <b-nav-item class="nav-link" active-class="active" to="/admin/overview">
          Overview
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" to="/admin/rooms">
          Rooms
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" to="/admin/reports">
          Reports
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" disabled to="/admin/settings">
          Settings
        </b-nav-item>
      </b-nav>
      <router-view class="h-100 backdrop" style="position: relative; margin-left: 145px !important;"></router-view>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AdminStats, ChatReportData } from "@port-of-mars/shared/types";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import Overview from "@port-of-mars/client/components/admin/Overview.vue";
import Rooms from "@port-of-mars/client/components/admin/Rooms.vue";
import Reports from "@port-of-mars/client/components/admin/Reports.vue";
import Settings from "@port-of-mars/client/components/admin/Settings.vue";

@Component({
  components: {
    Overview,
    Rooms,
    Reports,
    Settings
  }
})
export default class Admin extends Vue {
  api!: AdminAPI;
  adminStats: AdminStats = {
    totalGames: 0,
    activeGames: 0,
    defeats: { withBots: 0, withoutBots: 0 },
    victories: { withBots: 0, withoutBots: 0 },
    totalUsers: 0,
    reportedUsers: { resolved: 0, unresolved: 0 },
    bannedUsers: 0,
  }
  chatReports: Array<ChatReportData> = [];
  roomList: any = [];
  lobbyData: any = {};

  async created() {
    this.api = new AdminAPI(this.$tstore, this.$ajax);
    await this.initialize();
  }

  async initialize() {
    await this.fetchAdminStats();
    await this.fetchChatReports();
    await this.fetchActiveRoomsAndLobby();
  }

  async fetchAdminStats() {
    const adminStats = await this.api.getAdminStats();
    Vue.set(this, "adminStats", adminStats);
  }

  async fetchChatReports() {
    const chatReports = await this.api.getChatReports();
    Vue.set(this, "chatReports", chatReports);
  }

  async fetchActiveRoomsAndLobby() {
    const roomList = await this.api.getActiveRooms();
    const lobbyData = await this.api.getLobbyData();
    Vue.set(this, "roomList", roomList);
    Vue.set(this, "lobbyData", lobbyData);
  }
}
</script>

<style lang="scss" scoped>
.overflow-auto {
  overflow: auto;
}

.sidebar-wrapper {
  background-color: $dark;
  padding-right: 0;
}

.sidebar {
  border: none;
  .nav-link {
    color: #918d8d;
    &.active {
      background-color: $primary;
      color: #fff;
    }
  }
}
</style>
