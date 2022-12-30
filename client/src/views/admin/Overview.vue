<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <b-row class="m-0 mt-5 mr-4">
      <h4 style="margin-left: 2rem;">Games</h4>
      <div class="w-100"></div>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Games Completed"
          :stat="stats.totalGames"
        >
          <b-icon-check-circle-fill variant="light" font-scale="3"></b-icon-check-circle-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Victories*"
          :stat="stats.victories.withoutBots"
        >
          <b-icon-trophy-fill variant="success" font-scale="3"></b-icon-trophy-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Defeats*"
          :stat="stats.defeats.withoutBots"
        >
          <b-icon-lightbulb-off-fill variant="danger" font-scale="3"></b-icon-lightbulb-off-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Active Games"
          :stat="stats.activeGames"
        >
          <b-icon-stopwatch-fill variant="warning" font-scale="3"></b-icon-stopwatch-fill>
        </AdminStatCard>
      </b-col>
      <div class="w-100"></div>
      <p style="margin-left: 2rem;"><small>*Games with five human players</small></p>
    </b-row>
    <b-row class="m-0 mt-5 mr-4">
      <h4 style="margin-left: 2rem;">Players</h4>
      <div class="w-100"></div>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Verified Users"
          :stat="stats.totalUsers"
        >
          <b-icon-people-fill variant="success" font-scale="3"></b-icon-people-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Banned Users"
          :stat="stats.bannedUsers"
        >
          <b-icon-person-x-fill variant="warning" font-scale="3"></b-icon-person-x-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="New Reports"
          :stat="stats.reportedUsers.unresolved"
        >
          <b-icon-exclamation-circle-fill variant="danger" font-scale="3"></b-icon-exclamation-circle-fill>
        </AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Resolved Reports"
          :stat="stats.reportedUsers.resolved"
        >
          <b-icon-file-earmark-check-fill variant="light" font-scale="3"></b-icon-file-earmark-check-fill>
        </AdminStatCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import { AdminStats } from "@port-of-mars/shared/types";
import AdminStatCard from "@port-of-mars/client/components/admin/AdminStatCard.vue";

@Component({
  components: {
    AdminStatCard
  }
})
export default class Overview extends Vue {
  api!: AdminAPI;
  stats: AdminStats = {
    totalGames: 0,
    activeGames: 0,
    defeats: { withBots: 0, withoutBots: 0 },
    victories: { withBots: 0, withoutBots: 0 },
    totalUsers: 0,
    reportedUsers: { resolved: 0, unresolved: 0 },
    bannedUsers: 0,
  }
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
    await this.fetchAdminStats();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchAdminStats();
    }, 15 * 1000);
  }

  async fetchAdminStats() {
    const stats = await this.api.getAdminStats();
    Vue.set(this, "stats", stats);
  }
}
</script>

<style lang="scss" scoped>
</style>