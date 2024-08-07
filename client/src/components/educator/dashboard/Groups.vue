<template>
  <div>
    <div v-if="rooms.length < 1" class="empty-container">
      <p>Groups will display here once a game session has started.</p>
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
                  <b-icon-box-arrow-right class="float-right ml-2"></b-icon-box-arrow-right>
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
                <template #cell(points)="data"> {{ data.item.points }} points </template>
              </b-table>
            </div>
            <div v-else class="empty-container">
              <p>Inspect a game to see its state.</p>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <!-- mars log -->
        <b-col cols="6">
          <h4 class="header-nowrap">Mars Log</h4>
          <div class="content-container overflow-auto pl-3 py-1" style="height: 28vh">
            <MarsLog :logs="inspectData.marsLog" />
          </div>
        </b-col>
        <!-- chat -->
        <b-col cols="6">
          <h4 class="header-nowrap">Chat</h4>
          <div class="content-container overflow-auto p-2" style="height: 28vh">
            <Chat :messages="inspectData.chatMessages" :readOnly="true" :reportable="false" />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { InspectData, ClassroomData } from "@port-of-mars/shared/types";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import Chat from "@port-of-mars/client/components/game/static/chat/Chat.vue";
import StatusBar from "@port-of-mars/client/components/game/static/systemhealth/StatusBar.vue";

@Component({
  components: {
    Chat,
    MarsLog,
    StatusBar,
  },
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() educatorApi!: EducatorAPI;
  @Prop() selectedClassroom!: ClassroomData;

  pollingIntervalId = 0;
  inspectedRoomId: string = "";

  rooms: any = [];
  studentsInGames: any[] = [];

  roomFields = [
    { key: "roomId", label: "Room ID" },
    { key: "elapsed", label: "Elapsed", sortable: true },
    { key: "clients", label: "Players" },
    { key: "inspect", label: "" },
  ];

  inspectFields = [
    { key: "username", label: "Username", tdClass: "extra-small" },
    { key: "role", label: "Role", tdClass: "extra-small" },
    { key: "points", label: "Points", tdClass: "extra-small" },
  ];
  inspectData: InspectData = {
    players: [],
    systemHealth: 0,
    marsLog: [],
    chatMessages: [],
  };

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

  async fetchActiveRooms() {
    if (this.selectedClassroom) {
      try {
        const rooms = await this.educatorApi.getClassroomGames(this.selectedClassroom.id);
        Vue.set(this, "rooms", rooms);

        // Assuming the room object has a list of clients/students in it
        this.studentsInGames = rooms.flatMap((room: { clients: any }) => room.clients);
        console.log("Students in games:", this.studentsInGames);
      } catch (e) {
        console.error("Failed to get active rooms:", e);
      }
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

  async created() {
    await this.fetchActiveRooms();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchActiveRooms();
      await this.fetchInspectData(this.inspectedRoomId);
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
