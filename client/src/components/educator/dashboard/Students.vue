<template>
  <div>
    <div v-if="students.length < 1" class="empty-container">
      <p>Waiting for students to join...</p>
    </div>
    <b-row v-else>
      <b-col cols="12">
        <b-alert v-model="startGamesAlert" variant="success" dismissible
          >Successfully started games!</b-alert
        >
        <div class="d-flex justify-content-between align-items-end">
          <p>
            <b-icon-person-circle class="mr-2"></b-icon-person-circle>Students in Lobby:
            {{ numLobbyStudents }}
          </p>
          <b-button class="mb-3" variant="success" @click="startGames"
            ><h4 class="mb-0">Start Game</h4></b-button
          >
        </div>
        <div class="content-container">
          <b-table
            dark
            sticky-header
            sort-icon-left
            class="h-100 m-0 custom-table"
            style="overflow-y: auto; max-height: 58vh"
            :fields="studentFields"
            :items="students"
            sort-by="inLobby"
            :sort-desc="true"
          >
            <template #cell(inLobby)="data">
              <b-badge :variant="data.item.inLobby === true ? 'success' : 'danger'">
                {{ data.item.inLobby ? "Yes" : "No" }}
              </b-badge>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop, Watch } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { ClassroomData, StudentData } from "@port-of-mars/shared/types";

@Component({
  components: {},
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() educatorApi!: EducatorAPI;
  @Prop() selectedClassroom!: ClassroomData;
  @Watch("selectedClassroom")
  watchSelectedClassroom() {
    this.fetchStudents();
  }

  startGamesAlert = false;
  pollingIntervalId = 0;
  students: StudentData[] = [];

  studentFields = [
    { key: "username", label: "Username" },
    { key: "name", label: "Student Name", sortable: true },
    { key: "inLobby", label: "In Lobby", sortable: true },
  ];

  get numLobbyStudents() {
    return this.students.filter(student => student.inLobby).length;
  }

  async fetchStudents() {
    if (this.selectedClassroom) {
      try {
        const lobbyStudents = await this.educatorApi.getLobbyClients(this.selectedClassroom.id);
        const allStudents = await this.educatorApi.getClassroomStudents(this.selectedClassroom.id);
        if (!lobbyStudents) {
          this.students = allStudents;
        } else {
          this.students = allStudents.map((student: any) => {
            const inLobby = lobbyStudents.some(
              (lobbyStudent: any) => lobbyStudent.username === student.username
            );
            return { ...student, inLobby };
          });
        }
      } catch (e) {
        console.error("Failed to fetch lobby data", e);
      }
    }
  }

  async startGames() {
    if (this.selectedClassroom) {
      try {
        await this.educatorApi.startGames(this.selectedClassroom.id);
        this.startGamesAlert = true;
        console.log("Games started successfully");
      } catch (e) {
        console.error("Failed to start games:", e);
      }
    }
  }

  async created() {
    await this.fetchStudents();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchStudents();
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
