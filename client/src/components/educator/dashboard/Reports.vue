<template>
  <div>
    <div v-if="completedGames.length < 1" class="empty-container">
      <p>Reports will display once games have concluded.</p>
    </div>
    <b-row v-else>
      <!-- finished games -->
      <b-col :cols="inspectedCompletedGame ? '7' : '12'">
        <h4>Completed Games</h4>
        <div class="content-container">
          <b-table
            dark
            sticky-header
            class="h-100 m-0 custom-table"
            style="overflow-y: auto; max-height: 61vh"
            :fields="completedGameFields"
            :items="completedGames"
            sort-by="dateFinalized"
            :sort-desc="true"
          >
            <template #cell(dateFinalized)="data">
              {{ new Date(data.item.dateFinalized).toLocaleTimeString() }}
            </template>
            <template #cell(status)="data">
              <b-badge :variant="data.item.status === 'victory' ? 'success' : 'danger'">
                {{ data.item.status }}
              </b-badge>
            </template>
            <template #cell(players)="data">
              <b-icon-person-fill v-for="i in getHumanCount(data.item.players)" :key="'bot' + i" />
              <b-icon-laptop v-for="i in getBotCount(data.item.players)" :key="'human' + i" />
            </template>
            <template #cell(inspect)="data">
              <b-button
                variant="light"
                size="sm"
                class="float-right"
                :disabled="data.item.id === inspectedCompletedGame?.id"
                @click="inspectedCompletedGame = data.item"
                >Scoreboard
                <b-icon-box-arrow-right class="float-right ml-2"></b-icon-box-arrow-right>
              </b-button>
            </template>
          </b-table>
        </div>
        <!-- scoreboard -->
      </b-col>
      <b-col v-if="inspectedCompletedGame" cols="5">
        <h4 class="header-nowrap">Game #{{ inspectedCompletedGame.id }} Scoreboard</h4>
        <div class="content-container">
          <b-table
            dark
            sticky-header
            class="m-0 custom-table"
            style="overflow-y: auto; max-height: 61vh"
            :tbody-tr-attr="playerRowStyle"
            :fields="playerFields"
            :items="inspectedCompletedGame.players"
            sort-by="points"
            :sort-desc="true"
          >
            <template #cell(username)="data">
              <b-icon-laptop v-if="data.item.user.isSystemBot"></b-icon-laptop>
              <b-icon-person-fill v-else></b-icon-person-fill>
              {{ data.item.user.username }}
              <p style="margin-left: 1.3rem; margin-bottom: 0" v-if="!data.item.user.isSystemBot">
                {{ data.item.user.name }}
              </p>
            </template>
            <template #cell(points)="data">
              {{ data.item.points }}
              <b-badge
                variant="success"
                v-if="
                  isEligibleForPrize(data.item.user) &&
                  inspectedCompletedGame.highScore &&
                  data.item.points === inspectedCompletedGame.highScore
                "
                >winner</b-badge
              >
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { AdminGameData, ClientSafeUser, ClassroomData } from "@port-of-mars/shared/types";

@Component({
  components: {},
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() educatorApi!: EducatorAPI;
  @Prop() selectedClassroom!: ClassroomData;

  pollingIntervalId = 0;
  highestScore = 0;

  completedGames: AdminGameData[] = [];
  inspectedCompletedGame: AdminGameData | null = null;

  playerFields = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "points", label: "Points" },
  ];

  completedGameFields = [
    { key: "id", label: "Game ID" },
    { key: "dateFinalized", label: "Time Finished" },
    { key: "status", label: "Status" },
    { key: "players", label: "Players" },
    { key: "highScore", label: "High Score" },
    { key: "inspect", label: "" },
  ];

  getHumanCount(players: AdminGameData["players"]) {
    return players.filter(p => !p.user.isSystemBot).length;
  }

  getBotCount(players: AdminGameData["players"]) {
    return players.filter(p => p.user.isSystemBot).length;
  }

  playerRowStyle(item: any, type: any) {
    if (!item || type !== "row") return;
    else
      return {
        style: `background-color: var(--color-${item.role});`,
      };
  }

  findHighScores() {
    this.highestScore = 0;
    this.completedGames
      .filter((game: AdminGameData) => game.status === "victory")
      .forEach((game: AdminGameData) => {
        game.players.forEach((player: any) => {
          if (this.isEligibleForPrize(player.user)) {
            if (player.points > (game.highScore ?? 0)) {
              game.highScore = player.points;
            }
          }
          if ((game.highScore ?? 0) > this.highestScore) {
            this.highestScore = game.highScore ?? 0;
          }
        });
      });
  }

  isEligibleForPrize(user: ClientSafeUser) {
    return !user.isSystemBot && user.isVerified;
  }

  async fetchCompletedGames() {
    if (this.selectedClassroom) {
      try {
        this.completedGames = await this.educatorApi.getCompletedGames(this.selectedClassroom.id);
        this.findHighScores();
        console.log("Completed games: " + this.completedGames.length);
      } catch (e) {
        console.error("Failed to fetched completed games", e);
      }
    }
  }

  async created() {
    await this.fetchCompletedGames();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchCompletedGames();
    }, 5 * 1000);
  }

  beforeDestroy() {
    if (this.pollingIntervalId != 0) {
      window.clearInterval(this.pollingIntervalId);
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-container {
  color: var(--light-shade-25);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
