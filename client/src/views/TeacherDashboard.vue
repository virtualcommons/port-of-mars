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
                  @click="addClassroom"
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
                  selectClassroom(classroom);
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
            <div class="row pl-3 justify-content-between">
              <div>
                <h4>{{ selectedClassroom?.descriptor }}</h4>
                <h4>The Game Code for this Classroom is: {{ selectedClassroom.authToken }}</h4>
              </div>
              <b-cols class="mr-3">
                <b-button variant="success">Start Game</b-button>
              </b-cols>
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

                  <b-tab title="Group">
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
                          </div>
                        </b-col>
                      </b-row>
                      <b-row>
                        <!-- mars log -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Mars Log</h4>
                          <div class="content-container overflow-auto" style="height: 28vh">
                            <MarsLog :logs="inspectData.marsLog" />
                          </div>
                        </b-col>
                        <!-- chat -->
                        <b-col cols="6">
                          <h4 class="header-nowrap">Chat</h4>
                          <div class="content-container overflow-auto" style="height: 28vh">
                            <Chat
                              :messages="inspectData.chatMessages"
                              :readonly="true"
                              :reportable="false"
                            />
                          </div>
                        </b-col>
                      </b-row>
                    </div>
                  </b-tab>

                  <b-tab title="Reports" class="tab-header">
                    <div
                      v-if="completedGames < 1"
                      class="h-100 d-flex align-items-center justify-content-center"
                    >
                      <p style="color: rgba(241, 224, 197, 0.25)">
                        Reports will display once games have concluded.
                      </p>
                    </div>
                    <b-row v-else>
                      <!-- finished games -->
                      <b-col :cols="inspectedGame ? '7' : '12'">
                        <h4 class="header-nowrap">Completed Games</h4>
                        <div class="content-container">
                          <b-table
                            dark
                            sticky-header
                            class="h-100 m-0 custom-table"
                            style="overflow-y: auto; max-height: 64vh"
                            :fields="gameFields"
                            :items="games"
                            sort-by="highScore"
                            :sort-desc="true"
                          >
                            <template #cell(timeFinalized)="data">
                              {{ new Date(data.item.timeFinalized).toLocaleTimeString() }}
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
                                v-for="i in data.item.players"
                                :key="'human' + i"
                              />
                            </template>
                            <template #cell(inspect)="data">
                              <b-button
                                variant="light"
                                size="sm"
                                class="float-right"
                                :disabled="data.item.id === inspectedGame?.id"
                                @click="inspectedGame = data.item"
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
                      <b-col v-if="inspectedGame" cols="5" class="h-100 w-100">
                        <h4 class="header-nowrap">Game #{{ inspectedGame.id }} Scoreboard</h4>
                        <div class="content-container">
                          <b-table
                            dark
                            sticky-header
                            class="m-0 custom-table"
                            :tbody-tr-attr="playerRowStyle"
                            :fields="playerFields"
                            :items="inspectedGame.players"
                            sort-by="timeFinalized"
                            :sort-desc="true"
                          >
                            <template #cell(username)="data">
                              <b-icon-person-fill></b-icon-person-fill>
                              {{ data.item.username }}
                            </template>
                          </b-table>
                        </div>
                      </b-col>
                    </b-row>
                  </b-tab>

                  <b-tab title="Settings" class="w-75">
                    <b-card-text>Classroom Settings </b-card-text>
                    <b-row class="mb-3">
                      <b-col cols="2"
                        ><b-button
                          :pressed="false"
                          class="text-nowrap"
                          variant="warning"
                          @click="deleteClassroom"
                          >Delete Classroom</b-button
                        ></b-col
                      >
                      <b-col
                        ><b-button
                          :pressed="false"
                          class="text-nowrap"
                          variant="warning"
                          @click="toggleRename"
                          >Rename Classroom</b-button
                        ></b-col
                      >
                    </b-row>
                    <b-collapse v-model="isCollapsed" style="width: 35%">
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
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import LobbyChat from "@port-of-mars/client/components/lobby/LobbyChat.vue";
import { InspectData, AdminGameData } from "@port-of-mars/shared/types";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Messages,
    LobbyChat,
  },
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  // @Provide() api: TournamentLobbyRequestAPI = new TournamentLobbyRequestAPI(this.$ajax);
  educatorApi!: EducatorAPI;

  game = { name: GAME_PAGE };
  dashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  manual = { name: MANUAL_PAGE };
  consent = { name: CONSENT_PAGE };
  isTeacher = false;
  startGame = {};
  isCollapsed = false;
  classroomDescriptor = "";
  renameErrorMessage = "";
  completedGames = 1; //Temporary until finished games are implemented

  clientFields = [
    { key: "username", label: "Username" },
    { key: "firstName", label: "First" },
    { key: "lastName", label: "Last", sortable: true },
    { key: "status", label: "Lobby Status", sortable: true },
  ];

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
  rooms: any = [
    { roomId: "1", elapsed: 0, clients: 5 },
    { roomId: "2", elapsed: 0, clients: 3 },
    { roomId: "3", elapsed: 0, clients: 5 },
    { roomId: "4", elapsed: 0, clients: 5 },
    { roomId: "5", elapsed: 0, clients: 5 },
    { roomId: "6", elapsed: 0, clients: 5 },
  ]; //Mock room data

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

  async fetchInspectData(roomId: string) {
    //FIXME: using admin api, inspecting causes redirecting error
  }

  //WIP: Implement into the reports container
  gameFields = [
    { key: "id", label: "Room ID" },
    { key: "timeFinalized", label: "Time Finished" },
    { key: "status", label: "Status" },
    { key: "players", label: "Players" },
    { key: "highScore", label: "High Score" },
    { key: "inspect", label: "" },
  ];
  playerFields = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "points", label: "Points" },
  ];
  games = [
    //Temporary finished games
    {
      id: 1,
      timeFinalized: new Date(),
      status: "defeat",
      players: [
        { username: "1", role: "Researcher", points: 5 },
        { username: "2", role: "Curator", points: 3 },
        { username: "3", role: "Pioneer", points: 8 },
        { username: "4", role: "Entrepreneur", points: 12 },
        { username: "5", role: "Politician", points: 2 },
      ],
      highScore: 30,
      inspect: "",
    },
    {
      id: 2,
      timeFinalized: new Date(),
      status: "victory",
      players: [
        { username: "1", role: "Researcher", points: 12 },
        { username: "2", role: "Curator", points: 56 },
        { username: "3", role: "Pioneer", points: 24 },
      ],
      highScore: 92,
      inspect: "",
    },
  ];
  inspectedGame: any | null = null;

  getHumanCount(players: AdminGameData["players"]) {
    //TODO: Implement once we can get finished games req.
  }

  playerRowStyle(item: any, type: any) {
    if (!item || type !== "row") return;
    else
      return {
        style: `background-color: var(--color-${item.role});`,
      };
  }

  selectClassroom(classroom: Classroom) {
    console.log("Selected Classroom:", classroom);
    this.selectedClassroom = {...classroom};
    this.isCollapsed = false;
    //this.classroomDescriptor = "";
  }

  async addClassroom() {
    const descriptor = prompt("enter descriptor"); //FIXME: make stylized pop up
    if (!descriptor) {
      return; //FIXME: add in error message
    }
    try {
      const newClassroom = await this.educatorApi.createClassroom(descriptor);
      console.log("New Classroom:", newClassroom);
      this.classrooms.push(newClassroom);
      this.selectedClassroom = newClassroom;
    } catch (e) {
      console.error("Failed to add a new classroom:", e);
      
    }
  }



  async deleteClassroom() {
    if (this.classrooms.length === 0) {
      return;
    }

    try {
      await this.educatorApi.deleteClassroom(this.selectedClassroom.id);
      this.classrooms = await this.educatorApi.getClassrooms();
      // await this.fetchClassrooms();
      // this.classrooms = await this.educatorApi.getClassrooms();
      // this.classrooms = this.classrooms.filter(c => c.id !== this.selectedClassroom.id);
      
      if (this.classrooms.length > 0) {
        this.selectedClassroom = this.classrooms[0];
      } else {
        this.selectedClassroom = null;
      }
      this.isCollapsed = false;
      console.log("Classroom deleted successfully");

    } catch (e) {
      console.error("Failed to delete classroom:", e);
    }
  }
  

  async renameClassroom() {
    if (this.classroomDescriptor.length > 20) {
      this.renameErrorMessage = "Invalid classroom name. Please try again.";
    } else {
      try {
        await this.educatorApi.updateClassroom(this.selectedClassroom.id, this.classroomDescriptor);
        this.selectedClassroom.descriptor = this.classroomDescriptor;
        this.isCollapsed = false;
        //this.classroomDescriptor = "";
      } catch (e) {
        console.error("Failed to rename classroom", e);
        this.renameErrorMessage = "Failed to rename classroom. Please try again.";
      }
    }
  }

  clearRenameErrorMessage() {
    this.renameErrorMessage = "";
  }

  toggleRename() {
    this.isCollapsed = !this.isCollapsed;
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
      if (this.classrooms.length > 0){
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
