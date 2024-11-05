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
              <b-icon-person-fill v-for="i in getHumanCount(data.item.players)" :key="'bot' + i" />
              <b-icon-laptop v-for="i in getBotCount(data.item.players)" :key="'human' + i" />
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
                @click="inspectedCompletedGame = data.item"
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
import { AdminGameData, ClientSafeUser, ClassroomData } from "@port-of-mars/shared/types";
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

  completedGameFields = [
    { key: "id", label: "Game ID" },
    { key: "dateFinalized", label: "Time Finished", sortable: true },
    { key: "status", label: "Game Status", sortable: true },
    { key: "players", label: "Players" },
    { key: "highScore", label: "High Score" },
    { key: "inspect", label: "" },
  ];

  playerFields = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "points", label: "Points" },
  ];

  //Mock data for player points stats
  playerChartData = {
    labels: ["0", "1", "2", "3", "4", "5"],
    datasets: [
      { label: "OrbitingQuagga5472", borderColor: "#aa2929af", data: [0, 2, 5, 6, 6, 8] },
      { label: "IllustriousAxolotl8430", borderColor: "#6f248694", data: [0, 5, 6, 9, 12, 12] },
      { label: "IllustriousAxolotl8430", borderColor: "#437cae9a", data: [0, 2, 3, 4, 5, 5] },
      { label: "StellarGiraffe3352", borderColor: "#67411da8", data: [0, 4, 6, 7, 9, 10] },
      { label: "AuroralIguana1167", borderColor: "#c7a72898", data: [0, 3, 6, 7, 7, 9] },
    ],
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
    },
  };

  getHumanCount(players: AdminGameData["players"]) {
    // return players.filter(p => !p.user.isSystemBot).length;
    return players.filter(p => p.user && p.user.isSystemBot === false).length;
  }

  getBotCount(players: AdminGameData["players"]) {
    return players.filter(p => p.user && p.user.isSystemBot === true).length;
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
        const games = await this.educatorApi.getCompletedGames(this.selectedClassroom.id);
        console.log("game data received: ", games);

        this.completedGames = games.map(
          (game: { id: any; dateFinalized: any; status: any; players: any[] }) => ({
            id: game.id,
            dateFinalized: game.dateFinalized,
            status: game.status,
            players: game.players.map(player => ({
              name: player.user?.name || "Unknown",
              username: player.user?.username || "Unknown",
              isSystemBot: player.user?.isSystemBot ?? false,
            })),
          })
        );
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
