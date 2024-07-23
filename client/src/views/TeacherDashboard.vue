<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop overflow-hidden">
    <div class="h-100 w-100 d-flex flex-column">
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-3">
        <!--Classrooms Sidebar-->
        <b-col cols="2">
          <div class="mb-2 ml-3">
            <b-row>
              <h4 class="header-nowrap mt-2">Classrooms</h4>
              <p class="h4 mb-1">
                <b-icon
                  icon="plus"
                  class="icon ml-2 mt-2"
                  style="color: white; cursor: pointer"
                  v-b-modal.add-classroom-modal
                ></b-icon>
              </p>
            </b-row>
          </div>
          <div class="classrooms">
            <b-button-group vertical>
              <b-button
                v-for="classroom in classrooms"
                :key="classroom.id"
                variant="primary"
                class="mb-2 rounded"
                @click="
                  selectClassroom(classroom.id);
                  clearRenameErrorMessage();
                "
              >
                {{ classroom.descriptor }}
              </b-button>
            </b-button-group>
          </div>
        </b-col>
        <!--Main dashboard-->
        <b-col cols="10" class="content-container h-100 w-100 p-3 overflow-hidden">
          <div v-if="classrooms.length > 0" class="h-100 w-100">
            <div class="pl-3 row justify-content-between">
              <div>
                <h4>{{ selectedClassroom?.descriptor }}</h4>
                <h4>The Game Code for this Classroom is: {{ selectedClassroom.authToken }}</h4>
              </div>
              <div class="column mr-3">
                <b-button variant="success" @click="startGames">Start Game</b-button>
              </div>
            </div>
            <b-row>
              <div class="tabs-container w-100 h-100">
                <b-tabs pills card>
                  <!-- classroom roster -->
                  <b-tab title="Students" class="tab-header">
                    <div
                      v-if="clients.length < 1"
                      class="h-100 d-flex align-items-center justify-content-center"
                    >
                      <p style="color: rgba(241, 224, 197, 0.25)">
                        Waiting for students to join...
                      </p>
                    </div>
                    <div v-else>
                      <b-col cols="13">
                        <b-card-text>Students in Classroom: {{ clients.length }}</b-card-text>
                        <div class="content-container">
                          <b-table
                            dark
                            sticky-header
                            sort-icon-left
                            class="h-100 m-0 custom-table"
                            style="overflow-y: auto; max-height: 60vh"
                            :fields="clientFields"
                            :items="clients"
                            sort-by="lastName"
                            :sort-desc="true"
                          >
                            <template #cell(status)="data">
                              <b-badge
                                :variant="data.item.status === 'active' ? 'success' : 'danger'"
                              >
                                {{ data.item.status ? data.item.status : "inactive" }}
                              </b-badge>
                            </template>
                          </b-table>
                        </div>
                      </b-col>
                    </div>
                  </b-tab>

                  <b-tab title="Group" @click="fetchActiveRooms">
                    <div
                      v-if="rooms.length < 1"
                      class="h-100 d-flex align-items-center justify-content-center"
                    >
                      <p style="color: rgba(241, 224, 197, 0.25)">
                        Groups will display here once a game session has started.
                      </p>
                    </div>
                    <div v-else>
                      <b-row class="mb-2">
                        <!-- groups list -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Groups List</h4>
                          <div class="content-container" style="height: 28vh">
                            <b-table
                              dark
                              sticky-header
                              small
                              sort-icon-left
                              class="custom-table"
                              style="max-height: 27.5vh"
                              :fields="roomFields"
                              :items="rooms"
                              sort-by="elapsed"
                              :sort-desc="true"
                            >
                              <template #cell(elapsed)="data">
                                {{ formatTime(data.item.elapsed) }}
                              </template>
                              <template #cell(inspect)="data">
                                <b-button
                                  variant="primary"
                                  size="sm"
                                  class="float-right"
                                  :disabled="isInspectedRoom(data.item.roomId)"
                                  @click="fetchInspectData(data.item.roomId)"
                                  >Inspect
                                  <b-icon-box-arrow-right
                                    class="float-right ml-2"
                                  ></b-icon-box-arrow-right>
                                </b-button>
                              </template>
                            </b-table>
                          </div>
                        </b-col>
                        <!-- info -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Inspect Data</h4>
                          <div class="content-container overflow-auto" style="height: 28vh">
                            <div v-if="inspectedRoomId" class="h-100 p-2">
                              <div class="d-flex align-items-start">
                                <h5 class="mr-2">System Health</h5>
                                <StatusBar class="statusbar" :setWidth="inspectData.systemHealth" />
                                <h5 class="ml-2">{{ inspectData.systemHealth }}</h5>
                              </div>
                              <b-table
                                dark
                                sticky-header
                                small
                                thead-class="hidden-header"
                                class="h-75 m-0 custom-table"
                                :fields="inspectFields"
                                :items="inspectData.players"
                              >
                                <template #cell(username)="data">
                                  {{ data.item.username }}
                                  <b-badge v-if="data.item.isBot">bot</b-badge>
                                </template>
                                <template #cell(points)="data">
                                  {{ data.item.points }} points
                                </template>
                              </b-table>
                            </div>
                            <div
                              v-else
                              class="h-100 d-flex align-items-center justify-content-center"
                            >
                              <p style="color: rgba(241, 224, 197, 0.25)">
                                Inspect a game to see its state.
                              </p>
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <!-- mars log -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Mars Log</h4>
                          <div
                            class="content-container overflow-auto pl-3 py-1"
                            style="height: 28vh"
                          >
                            <MarsLog :logs="inspectData.marsLog" />
                          </div>
                        </b-col>
                        <!-- chat -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Chat</h4>
                          <div class="content-container overflow-auto p-2" style="height: 28vh">
                            <Chat
                              :messages="inspectData.chatMessages"
                              :readOnly="true"
                              :reportable="false"
                            />
                          </div>
                        </b-col>
                      </b-row>
                    </div>
                  </b-tab>

                  <b-tab title="Reports" class="tab-header" @click="fetchCompletedGames">
                    <div
                      v-if="completedGames.length < 1"
                      class="h-100 d-flex align-items-center justify-content-center"
                    >
                      <p style="color: rgba(241, 224, 197, 0.25)">
                        Reports will display once games have concluded.
                      </p>
                    </div>
                    <b-row v-else>
                      <!-- finished games -->
                      <b-col :cols="inspectedCompletedGame ? '7' : '12'">
                        <h4 class="header-nowrap">Completed Games</h4>
                        <div class="content-container">
                          <b-table
                            dark
                            sticky-header
                            class="h-100 m-0 custom-table"
                            style="overflow-y: auto; max-height: 61vh"
                            :fields="completedGameFields"
                            :items="completedGames"
                            sort-by="highScore"
                            :sort-desc="true"
                          >
                            <template #cell(dateFinalized)="data">
                              {{ new Date(data.item.dateFinalized).toLocaleTimeString() }}
                            </template>
                            <template #cell(status)="data">
                              <b-badge
                                :variant="data.item.status === 'victory' ? 'success' : 'danger'"
                              >
                                {{ data.item.status }}
                              </b-badge>
                            </template>
                            <template #cell(players)="data">
                              <b-icon-person-fill
                                v-for="i in getHumanCount(data.item.players)"
                                :key="'bot' + i"
                              />
                              <b-icon-laptop
                                v-for="i in getBotCount(data.item.players)"
                                :key="'human' + i"
                              />
                            </template>
                            <template #cell(highScore)="data">
                              {{ data.item.highScore }}
                            </template>
                            <template #cell(inspect)="data">
                              <b-button
                                variant="light"
                                size="sm"
                                class="float-right"
                                :disabled="data.item.id === inspectedCompletedGame?.id"
                                @click="inspectedCompletedGame = data.item"
                                >Scoreboard
                                <b-icon-box-arrow-right
                                  class="float-right ml-2"
                                ></b-icon-box-arrow-right>
                              </b-button>
                            </template>
                          </b-table>
                        </div>
                        <!-- scoreboard -->
                      </b-col>
                      <b-col v-if="inspectedCompletedGame" cols="5" class="h-100 w-100">
                        <h4 class="header-nowrap">
                          Game #{{ inspectedCompletedGame.id }} Scoreboard
                        </h4>
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
                              <p
                                style="margin-left: 1.3rem; margin-bottom: 0"
                                v-if="!data.item.user.isSystemBot"
                              >
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
                  </b-tab>
                  <b-tab title="Settings">
                    <b-card-text>Classroom Settings</b-card-text>
                    <b-row class="mb-3 pl-3">
                      <b-button
                        :pressed="false"
                        class="text-nowrap"
                        variant="warning"
                        @click="deleteClassroom"
                        >Delete Classroom</b-button
                      >
                      <b-col
                        ><b-button
                          :pressed="false"
                          class="text-nowrap"
                          variant="warning"
                          v-b-toggle="'rename-collapse'"
                          >Rename Classroom</b-button
                        ></b-col
                      >
                    </b-row>
                    <b-collapse id="rename-collapse" style="width: 30%">
                      <b-form-group description="Must be no more than 20 characters.">
                        <b-form-input
                          v-model="classroomDescriptor"
                          placeholder="Enter classroom name"
                          @input="clearRenameErrorMessage"
                        ></b-form-input>
                      </b-form-group>
                      <b-button
                        classroomDescriptor-clear
                        size="sm"
                        variant="success"
                        @click="renameClassroom"
                        >Submit</b-button
                      >
                      <b-alert class="mt-1" variant="danger" v-if="renameErrorMessage" show>{{
                        renameErrorMessage
                      }}</b-alert>
                    </b-collapse>
                  </b-tab>
                </b-tabs>
              </div>
            </b-row>
          </div>
          <div v-else>
            <h3 class="mt-2">No Classrooms Available</h3>
            <p>Please add a classroom using the plus sign button on the left</p>
          </div>
        </b-col>
      </b-row>
    </div>
    <b-modal
      id="add-classroom-modal"
      size="lg"
      title="Add a New Classroom"
      body-bg-variant="info"
      header-bg-variant="info"
      footer-bg-variant="info"
      @ok="handleDescriptorOk"
      @show="resetDescriptorModal"
      @hidden="resetDescriptorModal"
    >
      <form ref="form" @submit.stop.prevent="handleDescriptorSubmit">
        <b-form-group
          label="Enter Classroom Descriptor"
          label-for="descriptor-input"
          :state="descriptorState"
        >
          <b-form-input
            id="descriptor-input"
            v-model="classroomDescriptor"
            :state="descriptorState"
            required
          ></b-form-input>
          <b-form-invalid-feedback v-if="!descriptorState && !this.descriptorErrorMessage"
            >Descriptor is required</b-form-invalid-feedback
          >
          <b-form-invalid-feedback v-else-if="descriptorErrorMessage">{{
            descriptorErrorMessage
          }}</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import {
  GAME_PAGE,
  CONSENT_PAGE,
  MANUAL_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
} from "@port-of-mars/shared/routes";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import Chat from "@port-of-mars/client/components/game/static/chat/Chat.vue";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import { InspectData, AdminGameData, ClientSafeUser } from "@port-of-mars/shared/types";
import StatusBar from "@port-of-mars/client/components/game/static/systemhealth/StatusBar.vue";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Chat,
    MarsLog,
    StatusBar,
  },
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  educatorApi!: EducatorAPI;

  game = { name: GAME_PAGE };
  dashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  manual = { name: MANUAL_PAGE };
  consent = { name: CONSENT_PAGE };
  isTeacher = false;
  startGame = {};
  classroomDescriptor = "";
  renameErrorMessage = "";
  descriptorErrorMessage = "";
  descriptorState: boolean | null = null;

  clientFields = [
    { key: "username", label: "Username" },
    { key: "firstName", label: "First" },
    { key: "lastName", label: "Last", sortable: true },
    { key: "status", label: "Lobby Status", sortable: true },
  ];

  // FIXME: define these types
  classrooms: Classroom[] = [];
  selectedClassroom: Classroom | null = null;

  nextClassroomID: number = this.classrooms.length + 1;

  //WIP: Implement into the group container
  roomFields = [
    { key: "roomId", label: "Room ID" },
    { key: "elapsed", label: "Elapsed", sortable: true },
    { key: "clients", label: "Players" },
    { key: "inspect", label: "" },
  ];
  rooms: any = [];

  inspectData: InspectData = {
    players: [],
    systemHealth: 0,
    marsLog: [],
    chatMessages: [],
  };
  inspectFields = [
    { key: "username", label: "Username", tdClass: "extra-small" },
    { key: "role", label: "Role", tdClass: "extra-small" },
    { key: "points", label: "Points", tdClass: "extra-small" },
  ];
  inspectedRoomId: string = "";

  formatTime(time: number) {
    const mins = Math.floor(time / 1000 / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    } else {
      return `${mins} min${mins === 1 ? "" : "s"}`;
    }
  }

  isInspectedRoom(roomId: string) {
    return this.inspectedRoomId === roomId;
  }

  //FIXME: auto refresh to update game stats
  async fetchActiveRooms() {
    try {
      const rooms = await this.educatorApi.getClassroomGames(this.selectedClassroom.id);
      Vue.set(this, "rooms", rooms);
      console.log("Current active games: " + this.rooms.length);
    } catch (e) {
      console.error("Failed to get active rooms:", e);
    }
  }

  async fetchInspectData(roomId: string) {
    if (roomId) {
      this.inspectedRoomId = roomId;
      try {
        const data = await this.educatorApi.getInspectData(roomId);
        Vue.set(this, "inspectData", data);
      } catch (e) {
        console.log(e);
        Vue.set(this, "inspectData", {
          players: [],
          systemHealth: 0,
          marsLog: [],
          chatMessages: [],
        });
        this.inspectedRoomId = "";
      }
    }
  }

  //WIP: Implement into the reports container
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

  completedGames: AdminGameData[] = [];
  highestScore = 0;
  inspectedCompletedGame: AdminGameData | null = null;

  async fetchCompletedGames() {
    try {
      // this.completedGames = await this.educatorApi.getCompletedGames(this.selectedClassroom.id);
      // this.findHighScores();
      console.log("Completed games: " + this.completedGames.length);
    } catch (e) {
      console.error("Failed to fetched completed games", e);
    }
  }

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

  selectClassroom(classroomId: number) {
    const classroom = this.classrooms.find(c => c.id === classroomId);
    console.log(this.classrooms);
    console.log("Selected Classroom:", classroom);
    this.selectedClassroom = classroom;
  }

  checkDescriptorForm() {
    const form = this.$refs.form as HTMLFormElement | undefined;
    if (!form) {
      console.error("Form is not available");
      return false;
    }
    const valid = form.checkValidity();
    this.descriptorState = valid;
    return valid;
  }

  handleDescriptorOk(bvModalEvent: { preventDefault: () => void }) {
    if (!this.checkDescriptorForm()) {
      bvModalEvent.preventDefault();
    } else {
      const isDuplicate = this.classrooms.some(
        classroom => classroom.descriptor === this.classroomDescriptor
      );
      if (isDuplicate) {
        this.descriptorState = false;
        this.descriptorErrorMessage = "A classroom with this name already exists";
        bvModalEvent.preventDefault();
        return;
      } else {
        this.handleDescriptorSubmit();
      }
    }
  }

  handleDescriptorSubmit() {
    if (!this.checkDescriptorForm) {
      console.error("Descriptor form is not completed");
      return;
    } else {
      this.addClassroom();
      this.$nextTick(() => {
        this.$bvModal.hide("add-classroom-modal");
      });
    }
  }

  resetDescriptorModal() {
    this.classroomDescriptor = "";
    this.descriptorState = null;
  }

  async addClassroom() {
    if (!this.classroomDescriptor) {
      console.error("Empty classroom descriptor");
      return;
    }

    try {
      const newClassroom = await this.educatorApi.createClassroom(this.classroomDescriptor);
      console.log("New Classroom:", newClassroom);
      this.classrooms = await this.educatorApi.getClassrooms();
      this.selectClassroom(newClassroom.id);
    } catch (e) {
      console.error("Failed to add a new classroom:", e);
    }
  }

  async deleteClassroom() {
    if (this.classrooms.length === 0) {
      return;
    }
    try {
      this.classrooms = await this.educatorApi.deleteClassroom(this.selectedClassroom.id);
      await this.fetchClassrooms();
      console.log("Classroom list updated successfully");
    } catch (e) {
      console.error("Failed to delete classroom:", e);
    }
  }

  async renameClassroom() {
    if (this.classroomDescriptor.length > 20 || !this.classroomDescriptor) {
      this.renameErrorMessage = "Invalid classroom name. Please try again.";
    } else {
      const isDuplicate = this.classrooms.some(
        classroom => classroom.descriptor === this.classroomDescriptor
      );
      if (isDuplicate) {
        this.renameErrorMessage = "A classroom with this name already exists";
      } else {
        try {
          await this.educatorApi.updateClassroom(
            this.selectedClassroom.id,
            this.classroomDescriptor
          );
          this.classrooms = await this.educatorApi.getClassrooms();
          console.log("Classroom updated successfully");
          this.$root.$emit("bv::toggle::collapse", "rename-collapse");
          this.classroomDescriptor = "";
          this.selectClassroom(this.selectedClassroom.id);
        } catch (e) {
          console.error("Failed to rename classroom", e);
          this.renameErrorMessage = "Failed to rename classroom. Please try again.";
        }
      }
    }
  }

  async startGames() {
    try {
      await this.educatorApi.startGames(this.selectedClassroom.id);
    } catch (e) {
      console.error("Failed to start games:", e);
    }
  }

  clearRenameErrorMessage() {
    this.renameErrorMessage = "";
  }

  get clients() {
    return this.studentsByClassroom[this.selectedClassroom.id] || [];
  }

  studentsByClassroom: { [key: number]: Student[] } = {
    1: [
      {
        username: "Player 1",
        id: 1,
        firstName: "Mary",
        lastName: "Jones",
        dateJoined: new Date().getTime(),
        status: "active",
      },
      { username: "Player 2", id: 2, dateJoined: new Date().getTime() },
      { username: "Player 3", id: 3, dateJoined: new Date().getTime() },
      { username: "Player 4", id: 4, dateJoined: new Date().getTime() },
      { username: "Player 5", id: 5, dateJoined: new Date().getTime() },
      { username: "Player 6", id: 6, dateJoined: new Date().getTime() },
      { username: "Player 7", id: 7, dateJoined: new Date().getTime() },
      { username: "Player 8", id: 8, dateJoined: new Date().getTime() },
      { username: "Player 9", id: 9, dateJoined: new Date().getTime() },
    ],
    2: [
      { username: "Player 11", id: 11, dateJoined: new Date().getTime() },
      { username: "Player 12", id: 12, dateJoined: new Date().getTime() },
      { username: "Player 13", id: 13, dateJoined: new Date().getTime() },
      { username: "Player 14", id: 14, dateJoined: new Date().getTime() },
      { username: "Player 15", id: 15, dateJoined: new Date().getTime() },
      { username: "Player 16", id: 16, dateJoined: new Date().getTime() },
      { username: "Player 17", id: 17, dateJoined: new Date().getTime() },
      { username: "Player 18", id: 18, dateJoined: new Date().getTime() },
      { username: "Player 19", id: 19, dateJoined: new Date().getTime() },
      { username: "Player 20", id: 20, dateJoined: new Date().getTime() },
      { username: "Player 21", id: 21, dateJoined: new Date().getTime() },
      { username: "Player 22", id: 22, dateJoined: new Date().getTime() },
      { username: "Player 23", id: 23, dateJoined: new Date().getTime() },
    ],
  };

  get chatMessages() {
    return [];
    // return this.$tstore.state.lobby.chat;
  }

  async created() {
    //call to server to find out user's role
    // then add button above for starting game if user is a teacher
    this.educatorApi = new EducatorAPI(this.$store, this.$ajax);
    this.isTeacher = await this.educatorApi.authTeacher();
    await this.fetchClassrooms();
  }

  async fetchClassrooms() {
    try {
      this.classrooms = await this.educatorApi.getClassrooms();
      if (this.classrooms.length > 0) {
        this.selectedClassroom = this.classrooms[0];
      }
    } catch (e) {
      console.error("Failed to fetch classrooms:", e);
    }
  }
}
</script>

<style lang="scss" scoped>
.classrooms {
  padding: 0.1rem;
  height: 83%;
  overflow-y: auto;
}
.classrooms::-webkit-scrollbar {
  display: none;
}

.icon {
  vertical-align: text-top !important;
  font-size: 2rem;
}
</style>
