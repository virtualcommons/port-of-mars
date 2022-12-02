<template>
  <b-container fluid class="h-100 m-0 p-0 overflow-auto">
    <b-row class="m-2 mt-5">
      <h4 style="margin-left: 2rem;">Games</h4>
      <div class="w-100"></div>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Games Completed"
          :stat="stats.totalGames"
          icon="check-circle-fill"
          variant="light"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Victories*"
          :stat="stats.victories.withoutBots"
          icon="trophy-fill"
          variant="success"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Total Defeats*"
          :stat="stats.defeats.withoutBots"
          icon="lightbulb-off-fill"
          variant="danger"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Active Games"
          :stat="stats.activeGames"
          icon="stopwatch-fill"
          variant="warning"
        ></AdminStatCard>
      </b-col>
      <div class="w-100"></div>
      <p style="margin-left: 2rem;"><small>*Games with five human players</small></p>
    </b-row>
    <b-row class="m-2 mt-5">
      <h4 style="margin-left: 2rem;">Players</h4>
      <div class="w-100"></div>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Verified Users"
          :stat="stats.totalUsers"
          icon="people-fill"
          variant="success"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Banned Users"
          :stat="stats.bannedUsers"
          icon="person-x-fill"
          variant="warning"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="New Reports"
          :stat="stats.reportedUsers.unresolved"
          icon="exclamation-circle-fill"
          variant="danger"
        ></AdminStatCard>
      </b-col>
      <b-col cols="12" md="6" xl="3">
        <AdminStatCard
          title="Resolved Reports"
          :stat="stats.reportedUsers.resolved"
          icon="file-earmark-check-fill"
          variant="light"
        ></AdminStatCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AdminStats } from "@port-of-mars/shared/types";
import AdminStatCard from "@port-of-mars/client/components/admin/AdminStatCard.vue";

@Component({
  components: {
    AdminStatCard
  }
})
export default class Overview extends Vue {
  @Prop()
  stats!: AdminStats;
}
</script>

<style lang="scss" scoped>
</style>