<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 d-flex flex-column">
    <!-- 
      ------------------------------ -----------
      |         game list          | |  info   |
      ------------------------------ -----------
      -------------------- ---------------------
      |                  | |                   |
      |     mars log     | |       chat        |
      |                  | |                   |
      -------------------- ---------------------
     -->
    <div class="p-3 h-100">
      <b-row class="h-30 m-0">
        <!-- game list -->
        <b-col cols="6" class="mh-100 p-2">
          <h4 class="header-nowrap">
            Games List
            <b-badge v-if="lobby.clients" class="float-right" variant="warning">
              {{ lobby.clients }} Player(s) in lobby
            </b-badge>
          </h4>
          <div class="h-100-header w-100 content-container">
            <b-table dark sticky-header small
              class="h-100 m-0 custom-table"
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
                >Inspect <b-icon-box-arrow-right class="float-right ml-2"></b-icon-box-arrow-right>
                </b-button>
              </template>
            </b-table>
          </div>
        </b-col>
        <!-- info -->
        <b-col cols="6" class="mh-100 p-2">
          <h4 class="header-nowrap">Inspect Data</h4>
          <div class="h-100-header w-100 content-container">
            <div v-if="inspectedRoomId" class="h-100 p-2">
              <div class="d-flex align-items-start">
                <h5 class="mr-2">System Health</h5>
                <StatusBar class="statusbar" :setWidth="inspectData.systemHealth" />
                <h5 class="ml-2">{{ inspectData.systemHealth }}</h5>
              </div>
              <b-table dark sticky-header small
                thead-class="hidden-header"
                class="h-75 m-0 custom-table"
                :fields="inspectFields"
                :items="inspectData.players"
              >
                <template #cell(username)="data">
                  {{ data.item.username }} <b-badge v-if="data.item.isBot">bot</b-badge>
                </template>
                <template #cell(points)="data">
                  {{ data.item.points }} points
                </template>
              </b-table>
            </div>
            <div v-else class="h-100 d-flex align-items-center justify-content-center">
              <p style="color: rgba(241, 224, 197, 0.25)">
                Inspect a game to see its state.
              </p>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="h-70 w-100 m-0">
        <!-- mars log -->
        <b-col cols="6" class="mh-100 w-100 p-2">
          <h4 class="header-nowrap">Mars Log</h4>
          <div class="h-100-header w-100 content-container" style="overflow-y: auto">
            <MarsLog :logs="inspectData.marsLog"/>
          </div>
        </b-col>
        <!-- chat -->
        <b-col cols="6" class="mh-100 p-2">
          <h4 class="header-nowrap">Chat</h4>
          <div class="h-100-header w-100 content-container" style="overflow-y: auto">
            <Chat :messages="inspectData.chatMessages" :readOnly="true" :reportable="false"/>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import { InspectData } from "@port-of-mars/shared/types";
import Chat from "@port-of-mars/client/components/game/static/chat/Chat.vue";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import StatusBar from "@port-of-mars/client/components/game/static/systemhealth/StatusBar.vue";

@Component({
  components: {
    Chat,
    MarsLog,
    StatusBar
  }
})
export default class Rooms extends Vue {
  api!: AdminAPI;
  rooms: any = [];
  roomFields = [
    { key: "roomId", label: "Room ID" },
    { key: "elapsed", label: "Elapsed", sortable: true },
    { key: "clients", label: "Players" },
    { key: "inspect", label: "" },
  ];
  lobby: any = {};
  inspectData: InspectData = {
    players: [],
    systemHealth: 0,
    marsLog: [],
    chatMessages: []
  };
  inspectFields = [
    { key: "username", label: "Username", tdClass: "extra-small" },
    { key: "role", label: "Role", tdClass: "extra-small" },
    { key: "points", label: "Points", tdClass: "extra-small" },
  ];
  inspectedRoomId: string = "";
  pollingIntervalId = 0;

  formatTime(time: number) {
    const mins = Math.floor(time / 1000 / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours} hour${(hours === 1) ? "" : "s"}`;
    } else {
      return `${mins} min${(mins === 1) ? "" : "s"}`;
    }
  }
  
  isInspectedRoom(roomId: string) {
    return this.inspectedRoomId === roomId;
  }

  async created() {
    this.api = new AdminAPI(this.$store, this.$ajax);
    await this.initialize();
  }

  beforeDestroy() {
    if (this.pollingIntervalId != 0) {
      window.clearInterval(this.pollingIntervalId);
    }
  }

  async initialize() {
    await this.fetchActiveRoomsAndLobby();
    this.refresh();
  }

  async refresh() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.fetchActiveRoomsAndLobby();
      await this.fetchInspectData(this.inspectedRoomId);
    }, 5 * 1000);
  }

  async fetchActiveRoomsAndLobby() {
    const rooms = await this.api.getActiveRooms();
    const lobby = await this.api.getLobbyData();
    Vue.set(this, "rooms", rooms);
    Vue.set(this, "lobby", lobby);
  }

  async fetchInspectData(roomId: string) {
    if (roomId) {
      this.inspectedRoomId = roomId;
      try {
        const data = await this.api.getInspectData(roomId);
        Vue.set(this, "inspectData", data);
      } catch (e) {
        console.log(e);
        Vue.set(this, "inspectData", {
          players: [],
          systemHealth: 0,
          marsLog: [],
          chatMessages: []
        });
        this.inspectedRoomId = "";
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>