<template>
    <div>
    <b-container fluid>
        <b-row class="justify-content-start">
            <b-col cols="3">
            </b-col>
            <b-col>
                <h2>Teacher Dashboard</h2>
            </b-col>
        </b-row>
    <b-row>
      <b-col cols="3" class="sidebar">
        <h4>Classrooms</h4>
        <b-button-group vertical>
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
        <div class="mt-auto">
            <b-button variant="success" @click="addClassroom">
                Add Classroom
            </b-button>
        </div>
      </b-col>
      <b-col>
        <div v-if="classrooms.length > 0">
        <h4>{{ selectedClassroom.name }}</h4>
        <h4>The Game Code for this Classroom is: </h4>
        <b-row class="mb-3">
            <b-col cols="2"><b-button variant="success">Start Game</b-button></b-col>
            <b-col cols="2"><b-button variant="danger">Stop Game</b-button></b-col>
        </b-row>
        <b-tabs pills card>
            <b-tab title="Students" active>
                <b-card header="Students" :header-style="{ backgroundColor: '#f8f9fa' }">
                <b-card-text >
                    Students
                </b-card-text>
                </b-card>
                <b-row>
                    <b-col cols="6" v-for="client in clients" :key="client.id" class="mb-3">
                        <div class="player-card">
                            <span>{{ client.username }}</span>
                        </div>
                    </b-col>
                </b-row>
            </b-tab>
            <b-tab title="Groups">
                <b-card-text>Groups
                </b-card-text>
            </b-tab>
            <b-tab title="Reports">
                <b-card-text>
                    <b-tabs content-class="mt-3" align="left">
                        <b-tab title="Table1" active><p>Table 1</p></b-tab>
                        <b-tab title="Table2"><p>Table 2</p></b-tab>
                        <b-tab title="Table3"><p>Table 3</p></b-tab>
                    </b-tabs>
                </b-card-text>
            </b-tab>
            <b-tab title="Settings">
                <b-card-text>Classroom Settings 
                </b-card-text>
                <b-row>
                    <b-button variant="warning" @click="deleteClassroom">Delete this Classroom</b-button>
                </b-row>
            </b-tab>
        </b-tabs>
        </div>
        <div v-else>
            <h3>No Classrooms Available</h3>
            <p>Please add a classroom using the button on the left</p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script lang="ts">
import { Component, Provide, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { TournamentLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { TOURNAMENT_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import {
  GAME_PAGE,
  CONSENT_PAGE,
  MANUAL_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
} from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";
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

  clientFields = [{ key: "username", label: "Player" }];

  get constants() {
    return Constants;
  }

  classrooms: Classroom[] = [
    { id: 1, name: "Classroom #1" },
    { id: 2, name: "Classroom #2" },
  ];

  selectedClassroom: Classroom = this.classrooms[0];

  selectClassroom(classroom: Classroom){
    this.selectedClassroom = classroom;
  }

  addClassroom(){
    const classroomId = this.classrooms.length + 1;
    const newClassroom: Classroom = {
        id: classroomId, name: `Classroom #${classroomId}`,
    }

    this.classrooms.push(newClassroom);
    this.selectedClassroom = newClassroom;
  }

  deleteClassroom(){
    if (this.classrooms.length === 0){
        return;
    }
    this.classrooms = this.classrooms.filter(c => c.id !== this.selectedClassroom.id);
    delete this.studentsByClassroom[this.selectedClassroom.id];

    if (this.classrooms.length > 0){
        this.selectedClassroom = this.classrooms[0];
    } else {
        this.selectedClassroom = {id: 0, name: "No Classrooms Exist"};
    }
  }


  get clients(){
    return this.studentsByClassroom[this.selectedClassroom.id] || [];
  }

  studentsByClassroom: {[key: number]: Student[] } = {
    1: [
        { username: "Player 1", id: 1, dateJoined: new Date().getTime()},
        { username: this.$store.state.user.username, id: 2, dateJoined: new Date().getTime()},
        { username: "Player 3", id: 3, dateJoined: new Date().getTime()},
        { username: "Player 4", id: 4, dateJoined: new Date().getTime() },
        { username: "Player 5", id: 5, dateJoined: new Date().getTime() },
        { username: "Player 6", id: 6, dateJoined: new Date().getTime() },
        { username: "Player 7", id: 7, dateJoined: new Date().getTime() },
        { username: "Player 8", id: 8, dateJoined: new Date().getTime() },
        { username: "Player 9", id: 9, dateJoined: new Date().getTime() },
        { username: "Player 10", id: 10, dateJoined: new Date().getTime() },
    ],
    2: [
        { username: "Player 11", id: 11, dateJoined: new Date().getTime()},
        { username: "Player 12", id: 12, dateJoined: new Date().getTime()},
        { username: "Player 13", id: 13, dateJoined: new Date().getTime()},
        { username: "Player 14", id: 14, dateJoined: new Date().getTime() },
        { username: "Player 15", id: 15, dateJoined: new Date().getTime() },
        { username: "Player 16", id: 16, dateJoined: new Date().getTime() },
        { username: "Player 17", id: 17, dateJoined: new Date().getTime() },
        { username: "Player 18", id: 18, dateJoined: new Date().getTime() },
        { username: "Player 19", id: 19, dateJoined: new Date().getTime() },
        { username: "Player 20", id: 20, dateJoined: new Date().getTime() },
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

</style>