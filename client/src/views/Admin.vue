<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop overflow-auto">
    <b-tabs vertical class="h-100 w-100" nav-wrapper-class="sidebar-wrapper" nav-class="sidebar">
      <b-tab active class="h-100 w-100">
        <template #title>
          <b-icon icon="bar-chart-fill" class="mr-3"></b-icon>Overview
        </template>
        <Overview :stats="adminStats"></Overview>
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon icon="ui-radios" class="mr-3"></b-icon>Rooms
        </template>
        <Rooms></Rooms>
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon icon="flag-fill" class="mr-3"></b-icon>Reports
        </template>
        <Reports></Reports>
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon icon="calendar-week-fill" class="mr-3"></b-icon>Schedule
       </template>
       <Schedule></Schedule>
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon icon="trophy-fill" class="mr-3"></b-icon>Tournaments
        </template>
        <Tournaments></Tournaments>
      </b-tab>
      <b-tab>
        <template #title>
          <b-icon icon="gear-fill" class="mr-3"></b-icon>Settings
        </template>
        <Settings></Settings>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AdminStats } from "@port-of-mars/shared/types";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import Overview from "@port-of-mars/client/components/admin/Overview.vue";
import Rooms from "@port-of-mars/client/components/admin/Rooms.vue";
import Reports from "@port-of-mars/client/components/admin/Reports.vue";
import Schedule from "@port-of-mars/client/components/admin/Schedule.vue";
import Tournaments from "@port-of-mars/client/components/admin/Tournaments.vue";
import Settings from "@port-of-mars/client/components/admin/Settings.vue";

@Component({
  components: {
    Overview,
    Rooms,
    Reports,
    Schedule,
    Tournaments,
    Settings
  }
})
export default class Admin extends Vue {
  api!: AdminAPI;
  adminStats: AdminStats = {
    totalGames: 0,
    activeGames: 0,
    defeats: {
      withBots: 0,
      withoutBots: 0,
    },
    victories: {
      withBots: 0,
      withoutBots: 0,
    },
    totalUsers: 0,
    reportedUsers: {
      resolved: 0,
      unresolved: 0,
    },
    bannedUsers: 0,
  }

  async created() {
    this.api = new AdminAPI(this.$tstore, this.$ajax);
    await this.initialize();
  }

  async initialize() {
    const data = await this.api.getAdminStats();
    console.log(data);
    Vue.set(this, "adminStats", data)
  }
}
</script>

<style lang="scss">
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
    padding: 20px;
    border: none;
    border-radius: 0;
    color: #918d8d;
    &.active {
      background-color: $primary;
      color: #fff;
    }
  }
}
</style>
