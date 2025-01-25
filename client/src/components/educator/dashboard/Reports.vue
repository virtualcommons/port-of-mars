<template>
  <div>
    <div v-if="completedGames.length < 1" class="empty-container">
      <p>Reports will display once games have concluded.</p>
    </div>
    <b-row v-else>
      <!-- finished games -->
      <b-col v-if="!inspectedCompletedGame">
        <h4>Completed Games</h4>
        <div class="content-container">
          <b-table
            dark
            sticky-header
            sort-icon-left
            class="h-100 m-0 custom-table"
            style="overflow-y: auto; max-height: 60.5vh"
            :fields="completedGameFields"
            :items="completedGames"
            sort-by="dateFinalized"
            :sort-desc="true"
          >
            <template #cell(dateFinalized)="data">
              {{ new Date(data.item.dateFinalized).toLocaleString() }}
            </template>
            <template #cell(status)="data">
              <b-badge :variant="data.item.status === 'victory' ? 'success' : 'danger'">
                {{ data.item.status }}
              </b-badge>
            </template>
            <template #cell(players)="data">
              <b-icon-person-fill
                v-for="i in getHumanCount(data.item.players)"
                :key="'human' + i"
              />
              <b-icon-laptop v-for="i in getBotCount(data.item.players)" :key="'bot' + i" />
            </template>
            <template #cell(highScore)="data">
              {{ data.item.highScore }}
              <b-badge v-if="data.item.highScore === highestScore" variant="success"
                >winner <b-icon-award></b-icon-award
              ></b-badge>
              <p class="empty-container justify-content-start" v-else>Unavailable</p>
            </template>

            <template #cell(inspect)="data">
              <b-button
                variant="light"
                size="sm"
                class="float-right"
                @click="inspectGame(data.item)"
                >Inspect Stats
                <b-icon-box-arrow-right class="float-right ml-2"></b-icon-box-arrow-right>
              </b-button>
            </template>
          </b-table>
        </div>
      </b-col>
      <!-- selected game stats -->
      <b-row v-else class="w-100 h-100 m-0 justify-content-center">
        <b-col cols="4">
          <div class="mb-1">
            <b-button class="mr-3" variant="light" @click="inspectedCompletedGame = null">
              Return <b-icon-box-arrow-left class="float-left mr-2"></b-icon-box-arrow-left>
            </b-button>
            <b-dropdown text="Select Stat to View" variant="outline-primary" lazy>
              <b-dropdown-item-button @click="stat = 'Points'"
                >Player Points Stats</b-dropdown-item-button
              >
              <b-dropdown-item-button @click="stat = 'System'"
                >System Health Stats</b-dropdown-item-button
              >
              <b-dropdown-item-button @click="stat = 'Chat'">Chat History</b-dropdown-item-button>
            </b-dropdown>
          </div>
          <b-row class="ml-1">
            <h4 class="header-nowrap mt-3">Game #{{ inspectedCompletedGame.id }} Stats</h4>
          </b-row>
          <div class="content-container">
            <b-table
              dark
              sticky-header
              class="m-0 custom-table"
              style="overflow-y: auto; overflow-x: hidden; max-height: 60vh"
              :tbody-tr-attr="playerRowStyle"
              :fields="playerFields"
              :items="inspectedCompletedGame.players"
              sort-by="points"
              :sort-desc="true"
            >
              <template #cell(username)="data">
                <b-icon-laptop v-if="data.item.isSystemBot"></b-icon-laptop>
                <b-icon-person-fill v-else></b-icon-person-fill>
                {{ data.item.username || "Unknown" }}
                <p style="margin-left: 1.3rem; margin-bottom: 0" v-if="!data.item.isSystemBot">
                  {{ data.item.name || "Unknown" }}
                </p>
              </template>

              <template #cell(points)="data">
                {{ data.item.points }}
                <b-badge
                  variant="success"
                  v-if="
                    isEligibleForPrize(data.item) &&
                    inspectedCompletedGame.highScore &&
                    data.item.points === inspectedCompletedGame.highScore
                  "
                  >winner <b-icon-award></b-icon-award
                ></b-badge>
              </template>
            </b-table>
          </div>
        </b-col>
        <b-col cols="8" class="p-3" style="overflow-x: auto">
          <div v-if="stat == 'Points'">
            <LineChart :data="playerChartData" :options="playerChartOptions" />
          </div>
          <div v-if="stat == 'System'">
            <LineChart :data="systemHealthChart" :options="systemChartOptions" />
          </div>
          <div v-if="stat == 'Chat'">
            <h4>Chat History</h4>
            <div class="content-container" style="height: 60vh"></div>
          </div>
        </b-col>
      </b-row>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import {
  AdminGameData,
  ClientSafeUser,
  ClassroomData,
  GameReport,
  GamePlayer,
  ENTREPRENEUR,
} from "@port-of-mars/shared/types";
import { Line as LineChart } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js"; //Need to remove any unused imports later
import Game from "@port-of-mars/client/views/Game.vue";
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement);
ChartJS.defaults.color = "rgb(241, 224, 197)";
ChartJS.defaults.font.family = "Ruda";

@Component({
  components: { LineChart },
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() educatorApi!: EducatorAPI;
  @Prop() selectedClassroom!: ClassroomData;

  pollingIntervalId = 0;
  highestScore = 0;
  stat = "Points";

  completedGames: AdminGameData[] = [];
  inspectedCompletedGame: AdminGameData | null = null;
  // inspectedChatLogs: StudentChatMessageData[] = [];
  completedGames: GameReport[] = [];
  inspectedCompletedGame: GameReport | null = null;

  completedGameFields = [
    { key: "id", label: "Game ID" },
    { key: "dateFinalized", label: "Time Finished", sortable: true },
    { key: "status", label: "Game Status", sortable: true },
    { key: "players", label: "Players" },
    { key: "highScore", label: "High Score" },
    { key: "inspect", label: "" },
  ];

  playerFields = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "points", label: "Points" },
  ];

  playerChartData = {
    labels: [] as string[],
    datasets: [] as { label: string; borderColor: string; data: number[] }[],
  };

  playerChartOptions = {
    plugins: {
      title: {
        display: true,
        font: { size: 22 },
        padding: { bottom: 10 },
        text: "Total Player Points per Round",
      },
      legend: { labels: { boxWidth: 30, padding: 15 } },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: any) {
            return `Round: ${tooltipItems[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rounds",
          font: { size: 14 },
        },
      },
    },
  };

  // Mock data for system health stats
  systemHealthChart = {
    labels: ["0", "1", "2", "3", "4", "5"],
    datasets: [
      { label: "System Health", borderColor: "#5f8d4b", data: [100, 75, 60, 55, 42, 20, 0] },
    ],
  };
  systemChartOptions = {
    plugins: {
      title: {
        display: true,
        font: { size: 22 },
        padding: { bottom: 10 },
        text: "System Health Status per Round",
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: any) {
            return `Round: ${tooltipItems[0].label}`;
          },
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rounds",
          font: { size: 14 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Health (%)",
          font: { size: 14 },
        },
      },
    },
  };

  generatePlayerChartData() {
    if (!this.inspectedCompletedGame) return;

    const players = this.inspectedCompletedGame.players;
    console.log("Players: ", players);

    const playerColors = {
      Curator: "#67411da8",
      Researcher: "#437cae9a",
      Pioneer: "#6f248694",
      Politician: "#aa2929af",
      Entrepreneur: "#c7a72898",
    };

    const maxRounds = Math.max(...players.map(player => player.pointsByRound.length));
    console.log("max rounds: ", maxRounds);

    this.playerChartData.labels = Array.from({ length: maxRounds }, (_, i) => (i + 1).toString());

    this.playerChartData.datasets = players.map(player => {
      console.log("Player ${player.username} points:", player.pointsByRound); // Debug
      const playerColor = playerColors[player.role] || "#000000";
      console.log("Player role: ", player.role);
      return {
        label: player.username,
        borderColor: playerColor,
        data: player.pointsByRound || [],
      };
    });

    console.log("Chart generated:", this.playerChartData);
  }

  inspectGame(game: GameReport) {
    console.log(game);
    this.inspectedCompletedGame = game;
    this.generatePlayerChartData();
  }

  getHumanCount(players: GamePlayer[]) {
    return players.filter(player => !player.isSystemBot).length;
  }

  getBotCount(players: GamePlayer[]) {
    return players.filter(player => player.isSystemBot).length;
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
      .filter((game: GameReport) => game.status === "victory")
      .forEach((game: GameReport) => {
        game.players.forEach((player: GamePlayer) => {
          if (this.isEligibleForPrize(player)) {
            const points = player.points ?? 0;
            if (points > (game.highScore ?? 0)) {
              game.highScore = player.points;
            }
          }
          if ((game.highScore ?? 0) > this.highestScore) {
            this.highestScore = game.highScore ?? 0;
          }
        });
      });
  }

  isEligibleForPrize(player: GamePlayer) {
    return !player.isSystemBot;
  }

  async fetchCompletedGames() {
    if (this.selectedClassroom) {
      try {
        this.completedGames = await this.educatorApi.getCompletedGames(this.selectedClassroom.id);
        console.log("game data received: ", this.completedGames);

        this.findHighScores();
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
