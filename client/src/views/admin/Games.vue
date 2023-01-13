<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 d-flex flex-column">
    <!-- 
              filter options
      ------------------------------------------
      | [x]                                    |
      | [x]             games                  |
      | [ ]                                    |
      +----------------------------------------+
      |                players        +--------+
      |                               |download|
      --------------------------------+---------
     -->
    <div class="p-3 h-100">
      <b-row class="h-100 m-0">
        <!-- games -->
        <b-col :cols="showPlayers ? '7' : '12'" class="mh-100 p-2">
          <div>
            <h4 class="header-nowrap">Games</h4>
            <div id="filter-options" class="p-2">
              <b-form @submit="submitFilters" inline>
                <span class="mr-1">Show from</span>
                <b-form-datepicker dark
                  :date-format-options="datePickerFormat"
                  value-as-date
                  v-model="startDate"
                  :min="startDateConstraint.min"
                  :max="startDateConstraint.max"
                  size="sm"
                  class="mx-2"
                ></b-form-datepicker>
                <b-icon-arrow-right></b-icon-arrow-right>
                <b-form-datepicker dark
                  :date-format-options="datePickerFormat"
                  value-as-date
                  v-model="endDate"
                  :min="endDateConstraint.min"
                  :max="endDateConstraint.max"
                  size="sm"
                  class="mx-2"
                ></b-form-datepicker>
                <b-form-checkbox v-model="includeDefeats" class="mx-3">
                  <small style="line-height:1">Include<br>defeats</small>
                </b-form-checkbox>
                <b-form-checkbox v-model="includeBotGames" class="mx-3">
                  <small style="line-height:1">Include<br>bot games</small>
                </b-form-checkbox>
                <b-button
                  type="submit"
                  variant="success"
                  class="ml-2"
                  style="padding-top:.1rem; padding-bottom:.1rem;"
                >Filter</b-button>
              </b-form>
            </div>
          </div>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header
              class="h-100 m-0 custom-table"
              style="max-height: none;"
              :fields="gameFields"
              :items="games"
              sort-by="dateFinalized"
              :sort-desc="true" 
            >
              <!-- <template #cell(select)="data">
                <b-form-checkbox></b-form-checkbox>
              </template> -->
              <template #cell(dateFinalized)="data">
                {{ new Date(data.item.dateFinalized).toDateString() }}
              </template>
              <template #cell(status)="data">
                <b-badge :variant="data.item.status === 'victory' ? 'success' : 'danger'">
                  {{ data.item.status }}
                </b-badge>
              </template>
              <template #cell(players)="data">
                <b-icon-person-fill v-for="i in getHumanCount(data.item.players)" :key="'bot'+i"/>
                <b-icon-laptop v-for="i in getBotCount(data.item.players)" :key="'human'+i"/>
              </template>
              <template #cell(highScore)="data">
                {{ data.item.highScore }}
                <b-badge v-if="data.item.highScore === highestScore" variant="success">winner</b-badge>
              </template>
              <template #cell(inspect)="data">
                <b-button
                  variant="light"
                  size="sm"
                  class="float-right"
                  :disabled="isInspectedGame(data.item.id)"
                  @click="players = data.item.players; inspectedHighScore = data.item.highScore;"
                >Scoreboard <b-icon-box-arrow-right class="float-right ml-2"></b-icon-box-arrow-right>
                </b-button>
              </template>
            </b-table>
          </div>
        </b-col>
        <!-- players -->
        <b-col v-if="showPlayers" cols="5" class="mh-100 p-2">
          <h4 class="header-nowrap">
            Game #{{ this.players[0].gameId }} Scoreboard
          </h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header
              class="h-100 m-0 custom-table"
              style="max-height: none;"
              :tbody-tr-attr="playerRowStyle"
              :fields="playerFields"
              :items="players"
              sort-by="points"
              :sort-desc="true" 
            >
              <template #cell(username)="data">
                <b-icon-laptop v-if="data.item.user.isSystemBot"></b-icon-laptop>
                <b-icon-person-fill v-else></b-icon-person-fill>
                {{ data.item.user.username }}
              </template>
              <template #cell(points)="data">
                {{ data.item.points }}
                <b-badge variant="success"
                  v-if="isEligibleForPrize(data.item.user) && inspectedHighScore && data.item.points === inspectedHighScore"
                >winner</b-badge>
              </template>
              <template #cell(contact)="data">
                <b-button
                  v-if="isEligibleForPrize(data.item.user)"
                  variant="secondary"
                  size="sm"
                  class="py-0"
                  v-b-toggle="`contact-${data.item.user.id}`"
                >Show contact info</b-button>
                <b-collapse :id="`contact-${data.item.user.id}`">
                  <div class="backdrop p-2">
                    {{ data.item.user.name }}
                    &lt;<a :href="`mailto:${data.item.user.email}`">{{ data.item.user.email }}</a>&gt;
                  </div>
                </b-collapse>
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
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import StatusBar from "@port-of-mars/client/components/game/static/systemhealth/StatusBar.vue";

@Component({
  components: {
    MarsLog,
    StatusBar
  }
})
export default class Games extends Vue {
  api!: AdminAPI;

  games: any = [];
  gameFields = [
    // { key: "select", label: "Download" },
    { key: "id", label: "Game ID" },
    { key: "tournamentRoundId", label: "Round" },
    { key: "dateFinalized", label: "Date" },
    { key: "status", label: "Status" },
    { key: "players", label: "Players" },
    { key: "highScore", label: "High Score" },
    { key: "inspect", label: "" },
  ];
  players: any = [];
  playerFields = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "points", label: "Points" },
    { key: "contact", label: "Contact" },
  ];

  highestScore = 0;
  inspectedHighScore = 0;
  datePickerFormat = { year: "2-digit", month: "2-digit", day: "2-digit" };
  // default to last 14 days
  startDate = new Date(new Date().setDate(new Date().getDate() - 14));
  endDate = new Date();
  includeDefeats = true;
  includeBotGames = true;

  pollingIntervalId = 0;

  get startDateConstraint() {
    return {
      min: new Date(2020, 0, 1),
      max: this.endDate
    };
  }

  get endDateConstraint() {
    return {
      min: this.startDate,
      max: new Date()
    }
  }
  
  get showPlayers() {
    return this.players.length > 0;
  }

  isInspectedGame(id: number) {
    if (this.players.length === 0) {
      return false;
    }
    return id === this.players[0].gameId;
  }

  getBotCount(players) {
    return players.filter((p: any) => p.user.isSystemBot).length;
  }

  getHumanCount(players) {
    return players.filter((p: any) => !p.user.isSystemBot).length;
  }

  playerRowStyle(item, type) {
    if (!item || type !== "row") return;
    else return {
      style: `background-color: var(--color-${item.role});`
    }
  }
  
  async created() {
    this.api = new AdminAPI(this.$store, this.$ajax);
    await this.initialize();
  }

  async initialize() {
    await this.fetchGamesList();
  }

  async submitFilters(e: Event) {
    e.preventDefault();
    await this.fetchGamesList();
  }

  async fetchGamesList() {
    this.games = await this.api.getCompletedGames(
      this.startDate.toISOString().split("T")[0],
      this.endDate.toISOString().split("T")[0],
      this.includeBotGames,
      this.includeDefeats
    );
    this.findHighScores();
  }

  findHighScores() {
    // find the highest eligible (player is human, has email and name) score for each game
    this.highestScore = 0;
    this.games.forEach((game: any) => {
      game.highScore = 0;
      game.players.forEach((player: any) => {
        if (this.isEligibleForPrize(player.user)) {
          console.log("elligble");
          if (player.points > game.highScore) {
            game.highScore = player.points;
          }
        }
        if (game.highScore > this.highestScore) {
          this.highestScore = game.highScore;
        }
      });
    });
  }

  isEligibleForPrize(user) {
    return !user.isSystemBot && user.email && user.name;
  }
}
</script>

<style lang="scss" scoped>
#filter-options {
  position: absolute;
  top: 0;
  right: 0;
}

.h-100-header {
  height: calc(100% - 2rem);
}

.header-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>