<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-5" style="max-width: 1400px">
        <b-col :cols="sidebarExpanded ? 3 : 1" class="sidebar">
          <div class="d-flex align-items-start mb-2">
            <b-row>
              <h4 class="mb-0" v-if="sidebarExpanded">Classrooms</h4>
              <p class="h4 mb-2" v-if="sidebarExpanded">
                <b-icon
                  icon="plus"
                  class="icon ml-2"
                  style="color: white; margin: 0; cursor: pointer"
                  @click="addClassroom"
                ></b-icon>
              </p>
              <p class="h4 mb-2">
                <b-icon
                  :icon="sidebarExpanded ? 'chevron-left' : 'chevron-right'"
                  class="icon ml-2"
                  style="margin: 0; cursor: pointer"
                  variant="danger"
                  @click="toggleSidebar"
                ></b-icon>
              </p>
            </b-row>
          </div>
          <b-button-group vertical v-if="sidebarExpanded">
            <b-button
              v-for="classroom in classrooms"
              :key="classroom.id"
              variant="primary"
              class="mb-2"
              @click="selectClassroom(classroom)"
            >
              {{ classroom.name }}
            </b-button>
          </b-button-group>
        </b-col>
        <b-col
          :cols="sidebarExpanded ? 9 : 11"
          :class="{ 'content-container-collapsed': '!sidebarExpanded' }"
          class="content-container h-100"
        >
          <div v-if="classrooms.length > 0">
            <h4>{{ selectedClassroom.name }}</h4>
            <h4>The Game Code for this Classroom is:</h4>
            <b-row class="mb-3 d-flex align-items-start">
              <b-col cols="2"><b-button variant="success">Start Game</b-button></b-col>
              <b-col cols="2"><b-button variant="danger">Stop Game</b-button></b-col>
            </b-row>
            <b-row class="mb-3 d-flex align-items-start">
              <div class="tabs-container">
                <b-tabs pills card>
                  <b-tab title="Students" active>
                    <p>Students in Classroom: {{ clients.length }}</p>
                    <b-row>
                      <b-col cols="6" v-for="client in clients" :key="client.id" class="mb-3">
                        <div class="player-card">
                          <span>{{ client.username }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Groups">
                    <b-card-text>
                      <b-button-group>
                        <b-button
                          v-for="group in groups"
                          :key="group.id"
                          variant="primary"
                          class="mb-2"
                          @click="selectGroup(group)"
                          >{{ group.name }}</b-button
                        >
                      </b-button-group>
                    </b-card-text>
                  </b-tab>
                  <b-tab title="Reports">
                    <b-card-text>
                      <b-tabs content-class="mt-3" align="left">
                        <b-tab title="Table1" active><p>Table 1</p></b-tab>
                        <b-tab title="Table2"><p>Table 2</p></b-tab>
                        <b-tab title="Graph"><p>Graph</p></b-tab>
                      </b-tabs>
                    </b-card-text>
                  </b-tab>
                  <b-tab title="Settings">
                    <b-card-text>Classroom Settings </b-card-text>
                    <b-row>
                      <b-button variant="warning" @click="deleteClassroom"
                        >Delete this Classroom</b-button
                      >
                    </b-row>
                  </b-tab>
                </b-tabs>
              </div>
            </b-row>
          </div>
          <div v-else>
            <h3>No Classrooms Available</h3>
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

  clientFields = [{ key: "username", label: "Player" }];

  classrooms: Classroom[] = [
    { id: 1, name: "Classroom #1" },
    { id: 2, name: "Classroom #2" },
  ];

  groups: Group[] = [
    { id: 1, name: "Group #1" },
    { id: 2, name: "Group #2" },
  ];

  selectedClassroom: Classroom = this.classrooms[0];
  selectedGroup: Group = this.groups[0];

  nextClassroomID: number = this.classrooms.length + 1;

  selectClassroom(classroom: Classroom) {
    this.selectedClassroom = classroom;
  }

  selectGroup(group: Group) {
    this.selectGroup = group;
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

    if (this.classrooms.length > 0) {
      this.selectedClassroom = this.classrooms[0];
    } else {
      this.selectedClassroom = { id: 0, name: "No Classrooms Exist" };
      this.nextClassroomID = 1;
    }
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
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
    ],

    3: [
      { username: "Player 21", id: 21, dateJoined: new Date().getTime() },
      { username: "Player 22", id: 22, dateJoined: new Date().getTime() },
      { username: "Player 23", id: 23, dateJoined: new Date().getTime() },
      { username: "Player 24", id: 24, dateJoined: new Date().getTime() },
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
.player-card {
  background-color: #333333;
  border: 1x solid #444444;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  height: 3rem;
  width: 100%;
  word-wrap: break-word;
}

.sidebar {
  background-color: lightgrey;
  padding: 1rem;
  height: 100vh;
}

.icon {
  vertical-align: text-top !important;
  font-size: 2rem;
}

.tabs-container {
  padding-left: 0.3rem;
}

.content-container-collapsed {
  padding-left: 1rem;
  margin-left: 1rem;
}
</style>
