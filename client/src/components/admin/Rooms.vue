<template>
  <b-container fluid class="h-100 w-100 my-4 ml-2 p-0">
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
    <b-row align-v="stretch">
      <!-- game list -->
      <b-col cols="7" class="p-2">
        <b-container fluid class="h-100 w-100 m-0 p-0">
          <div class="h-100 w-100 content-container">
            <b-table dark sticky-header
              class="m-0 custom-table"
              :fields="fields"
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
                  :disabled="isInspectedRoom(data.item.roomId)"
                  @click="fetchInspectData(data.item.roomId)"
                >Inspect <b-icon class="float-right ml-2" icon="box-arrow-right"></b-icon>
                </b-button>
              </template>
            </b-table>
          </div>
        </b-container>
      </b-col>
      <!-- info -->
      <b-col cols="5" class="p-2">
        <b-container fluid class="h-100 w-100 m-0 p-0">
          <div class="h-100 w-100 content-container">
            <p>player data placeholder</p>
          </div>
        </b-container>
      </b-col>
    </b-row>
    <b-row class="h-100 w-100">
      <!-- mars log -->
      <b-col cols="6" class="h-100 w-100 p-2">
        <b-container fluid class="h-100 w-100 m-0 p-0">
          <div class="h-100 w-100 content-container">
            <MarsLog :logs="inspectData.marsLog"/>
          </div>
        </b-container>
      </b-col>
      <!-- chat -->
      <b-col cols="6" class="p-2">
        <b-container fluid class="h-100 w-100 m-0 p-0">
          <div class="h-100 w-100 content-container">
            <Chat :messages="inspectData.chatMessages" :readOnly="true" :reportable="false"/>
          </div>
        </b-container>
      </b-col>
    </b-row>
    
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";
import { InspectData } from "@port-of-mars/shared/types";
import Chat from "@port-of-mars/client/components/game/static/chat/Chat.vue";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";

@Component({
  components: {
    Chat,
    MarsLog
  }
})
export default class Rooms extends Vue {
  @Prop()
  rooms!: any;

  @Prop()
  lobby!: any;

  api!: AdminAPI;
  inspectData: InspectData = {
    marsLog: [],
    chatMessages: []
  };
  inspectedRoomId: string = "";

  fields = [
    { key: "roomId", label: "Room ID" },
    { key: "elapsed", label: "Elapsed", sortable: true },
    { key: "clients", label: "Players" },
    { key: "inspect", label: "" },
  ];

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
  }

  async fetchInspectData(roomId: string) {
    this.inspectedRoomId = roomId;
    const data = await this.api.getInspectData(roomId);
    Vue.set(this, "inspectData", data);
  }
}
</script>

<style lang="scss" scoped>
</style>