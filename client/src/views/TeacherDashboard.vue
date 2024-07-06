<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-3">
        <!--Classrooms Sidebar-->
        <b-col cols="2" class="pl-5">
          <div class="d-flex mb-2 ml-3">
            <b-row>
              <h4 class="mb-0 mt-2">Classrooms</h4>
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
                {{ classroom.name }}
              </b-button>
            </b-button-group>
          </div>
        </b-col>
        <!--Main dashboard-->
        <b-col cols="10" class="content-container h-100 w-100 p-3 overflow-hidden">
          <div v-if="classrooms.length > 0">
            <div class="row pl-3 justify-content-between">
              <div>
                <h4>{{ selectedClassroom.name }}</h4>
                <h4>The Game Code for this Classroom is:</h4>
              </div>
              <b-cols class="mt-1">
                <b-button variant="success">Start Game</b-button>
                <b-button variant="danger" class="mx-3">Stop Game</b-button>
              </b-cols>
            </div>
            <b-row>
              <div class="tabs-container">
                <b-tabs pills card>
                  <b-tab title="Students" class="tab-header">
                    <p>Students in Classroom: {{ clients.length }}</p>
                    <b-row class="overflow-y-auto overflow-x-hidden pt-1 px-4">
                      <b-col cols="2" v-for="client in clients" :key="client.id" class="mb-4">
                        <div class="player-card">
                          <p class="mb-1">[First Name] [Last Initial].</p>
                          <span>{{ client.username }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Group">
                    <div v-if="rooms.length < 1">
                      <h3 class="ml-1">Groups will display here once a game has started.</h3>
                    </div>
                    <b-row class="mb-2" style="width: 80.5vw" v-else>
                      <!-- game list -->
                      <b-col cols="6">
                        <h4 class="header-nowrap">Games List</h4>
                        <div
                          class="h-100-header w-100 content-container overflow-y-auto"
                          style="height: 28vh"
                        >
                          <b-table
                            dark
                            sticky-header
                            small
                            class="h-100 custom-table overflow-hidden"
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
                        <div
                          class="h-100-header w-100 content-container overflow-y-auto"
                          style="height: 28vh"
                        >
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
                          class="h-100-header w-100 content-container overflow-y-auto"
                          style="height: 28vh"
                        >
                          <MarsLog :logs="inspectData.marsLog" />
                        </div>
                      </b-col>
                      <!-- chat -->
                      <b-col cols="6">
                        <h4 class="header-nowrap">Chat</h4>
                        <div
                          class="h-100-header w-100 content-container overflow-y-auto"
                          style="height: 28vh"
                        >
                          <Chat
                            :messages="inspectData.chatMessages"
                            :readonly="true"
                            :reportable="false"
                          />
                        </div>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Reports" class="tab-header">
                    <b-row class="mb-2" style="width: 80.5vw">
                      <b-col cols="8">
                        <!-- report list -->
                        <h4 class="header-nowrap">Reported Chat Messages</h4>
                        <div class="h-100-header w-100 content-container" style="height: 61vh">
                          <b-table
                            dark
                            sticky-header
                            sort-icon-left
                            class="h-100 m-0"
                            style="max-height: none"
                            :fields="reportFields"
                            :items="reports"
                            sort-by="dateCreated"
                            :sort-desc="true"
                          ></b-table>
                        </div>
                      </b-col>
                      <b-col cols="4">
                        <!-- action log -->
                        <h4 class="header-nowrap">Actions Log</h4>
                        <div class="h-100-header w-100 content-container">
                          <b-table
                            dark
                            sticky-header
                            sort-icon-left
                            class="h-100 m-0"
                            style="max-height: none"
                            :fields="moderationActionFields"
                            :items="moderationActions"
                          ></b-table>
                        </div>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Settings" class="tab-header">
                    <b-card-text>Classroom Settings</b-card-text>
                    <b-row class="mb-3 d-flex align-items-left">
                      <b-col cols="6"
                        ><b-button
                          :pressed="false"
                          class="w-150 mb-2"
                          variant="warning"
                          @click="deleteClassroom"
                          >Delete Classroom</b-button
                        ></b-col
                      >
                      <b-col cols="6"
                        ><b-button
                          :pressed="false"
                          class="w-150 mb-2 text-nowrap"
                          variant="warning"
                          @click="toggleRename"
                          >Rename Classroom</b-button
                        ></b-col
                      >
                    </b-row>
                    <b-collapse class="pt-1" id="renameCollapase" v-model="isCollapsed">
                      <b-form-input
                        v-model="classroomName"
                        placeholder="Enter classroom name (max. 20 characters)"
                        @input="clearRenameErrorMessage"
                      >
                      </b-form-input>
                      <b-button
                        class="mt-1 mb-1"
                        size="sm"
                        variant="success"
                        @click="renameClassroom"
                        >Submit</b-button
                      >
                      <b-alert variant="danger" v-if="renameErrorMessage" show>{{
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
import {
  InspectData,
  ChatReportData,
  ModerationActionClientData,
} from "@port-of-mars/shared/types";

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
  sidebarExpanded = true;
  isCollapsed = false;
  classroomName = "";
  renameErrorMessage = "";

  clientFields = [{ key: "username", label: "Player" }];

  classrooms: Classroom[] = [
    { id: 1, name: "Classroom #1" },
    { id: 2, name: "Classroom #2" },
  ];

  selectedClassroom: Classroom = this.classrooms[0];

  nextClassroomID: number = this.classrooms.length + 1;

  //WIP: Implement into the group container
  roomFields = [
    { key: "roomId", label: "Room ID" },
    { key: "elapsed", label: "Elapsed", sortable: true },
    { key: "clients", label: "Players" },
    { key: "inspect", label: "" },
  ];
  rooms: any = [{ roomId: "12sfa98h", elapsed: 0, clients: 5, inspect: "N/A" }]; //Temporary room

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

  //WIP: Implement into the reports container
  reports: Array<ChatReportData> = [];
  reportFields = [
    { key: "dateCreated", label: "Time", sortable: true },
    { key: "roomId", label: "Room" },
    { key: "user", label: "User" },
    { key: "message", label: "Message" },
    { key: "action", label: "Action" },
  ];

  moderationActions: Array<ModerationActionClientData> = [];
  moderationActionFields = [
    { key: "adminUsername", label: "Admin" },
    { key: "username", label: "User" },
    { key: "action", label: "Action", sortable: true },
    { key: "dateMuteExpires", label: "Expires" },
    { key: "undo", label: "" },
  ];

  selectClassroom(classroom: Classroom) {
    this.selectedClassroom = classroom;
    this.isCollapsed = false;
    this.classroomName = "";
  }

  addClassroom() {
    const newClassroom: Classroom = {
      id: this.nextClassroomID,
      name: `Classroom #${this.nextClassroomID}`,
    };

    this.classrooms.push(newClassroom);
    this.selectedClassroom = newClassroom;
    this.nextClassroomID++;
  }

  deleteClassroom() {
    if (this.classrooms.length === 0) {
      return;
    }
    this.classrooms = this.classrooms.filter(c => c.id !== this.selectedClassroom.id);
    delete this.studentsByClassroom[this.selectedClassroom.id];

    if (this.classroomName || this.renameErrorMessage) {
      this.classroomName = "";
      this.renameErrorMessage = "";
    }
    this.isCollapsed = false;

    if (this.classrooms.length > 0) {
      this.selectedClassroom = this.classrooms[0];
    } else {
      this.selectedClassroom = { id: 0, name: "No Classrooms Exist" };
      this.nextClassroomID = 1;
    }
  }

  renameClassroom() {
    if (this.classroomName.length > 20) {
      this.renameErrorMessage = "Invalid classroom name. Please try again.";
    } else {
      this.selectedClassroom.name = this.classroomName;
      this.isCollapsed = false;
      this.classroomName = "";
    }
  }

  clearRenameErrorMessage() {
    this.renameErrorMessage = "";
  }

  toggleRename() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

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
    //TODO: Implement data from game session depending on group selected
  }

  get clients() {
    return this.studentsByClassroom[this.selectedClassroom.id] || [];
  }

  studentsByClassroom: { [key: number]: Student[] } = {
    1: [
      { username: "Player 1", id: 1, dateJoined: new Date().getTime() },
      { username: this.$store.state.user.username, id: 2, dateJoined: new Date().getTime() },
      { username: "Player 3", id: 3, dateJoined: new Date().getTime() },
      { username: "Player 4", id: 4, dateJoined: new Date().getTime() },
      { username: "Player 5", id: 5, dateJoined: new Date().getTime() },
      { username: "Player 6", id: 6, dateJoined: new Date().getTime() },
      { username: "Player 7", id: 7, dateJoined: new Date().getTime() },
      { username: "Player 8", id: 8, dateJoined: new Date().getTime() },
      { username: "Player 9", id: 9, dateJoined: new Date().getTime() },
      { username: "Player 10", id: 10, dateJoined: new Date().getTime() },
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
      { username: "Player 24", id: 24, dateJoined: new Date().getTime() },
      { username: "Player 25", id: 25, dateJoined: new Date().getTime() },
    ],

    3: [
      { username: "Player 26", id: 26, dateJoined: new Date().getTime() },
      { username: "Player 27", id: 27, dateJoined: new Date().getTime() },
      { username: "Player 28", id: 28, dateJoined: new Date().getTime() },
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
  }
}
</script>

<style lang="scss" scoped>
.classrooms {
  height: 80vh;
  overflow-y: auto;
}
.classrooms::-webkit-scrollbar {
  display: none;
}

.player-card {
  background-color: #333333;
  border: 2px solid #444444;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  overflow: hidden;
  text-align: left;
  max-width: 4.5rem;
  max-width: 19rem;
}

.sidebar {
  //FIXME: Does not show up in the webpage
  background-color: lightgrey;
  padding: 3rem;
  height: 100vh;
}

.icon {
  vertical-align: text-top !important;
  font-size: 2rem;
}

.content-container-collapsed {
  padding-left: 1rem;
  margin-left: 1rem;
}
</style>
