<template>
  <b-row class="h-100 w-100" no-gutters>
    <b-col cols="7">
      <div id="rooms" class="h-100 content-container mr-3">
        <b-table
          dark
          sticky-header
          class="h-100 m-0 custom-table"
          style="max-height: none"
          :fields="roomFields"
          :items="rooms"
          sort-by="dateCreated"
          :sort-desc="true"
        >
          <template #cell(numClients)="data">
            <b-icon-person-fill v-for="i in data.item.numClients" :key="'filled-' + i" />
            <b-icon-person-fill
              variant="info"
              v-for="i in 5 - data.item.numClients"
              :key="'open-' + i"
            />
          </template>
          <template #cell(name)="data"> {{ data.item.leader }}'s room </template>
          <template #cell(action)="data">
            <b-button
              size="sm"
              variant="primary"
              class="float-right"
              @click.once="$emit('joinRoom', data.item.id)"
              :disabled="isBanned"
            >
              Join
            </b-button>
          </template>
          <template #cell(dateCreated)></template>
          <template #head(action)>
            <b-button
              v-if="!refreshingRoomList"
              size="sm"
              variant="link"
              class="float-right p-0"
              @click="refreshRoomList"
            >
              <b-icon-arrow-clockwise
                font-scale="1.5"
                style="color: white"
              ></b-icon-arrow-clockwise>
            </b-button>
            <b-spinner
              v-else
              small
              label="..."
              class="float-right mr-1 mb-1"
              style="margin-left: 3px"
            ></b-spinner>
          </template>
        </b-table>
      </div>
    </b-col>
    <b-col cols="5">
      <div id="actions" class="pl-3">
        <b-button
          size="lg"
          v-if="rooms.length > 0"
          title="Join the room with the most players"
          variant="primary"
          class="w-100 mb-3"
          @click.once="joinFullestRoom"
          :disabled="isBanned"
        >
          <h4>Join Existing Room</h4>
        </b-button>
        <b-button
          size="lg"
          variant="success"
          class="w-100 mb-3"
          @click.once="
            $emit('createRoom');
            clickedCreateRoom = true;
          "
          :disabled="isBanned"
        >
          <h4>Create Room</h4>
        </b-button>
        <b-button
          size="lg"
          variant="warning"
          class="w-100 mb-3"
          @click.once="$emit('startSoloWithBots')"
          :disabled="isBanned"
        >
          <h4>Play vs Bots</h4>
        </b-button>
        <MuteBanWarning class="mt-3"></MuteBanWarning>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { Constants } from "@port-of-mars/shared/settings";
import MuteBanWarning from "@port-of-mars/client/components/lobby/MuteBanWarning.vue";

@Component({
  components: {
    MuteBanWarning,
  },
})
export default class LobbyRoomList extends Vue {
  @Inject() readonly $client!: Client;

  roomFields = [
    { key: "numClients", label: "Players" },
    { key: "name", label: "Room" },
    { key: "dateCreated", label: "" },
    { key: "action", label: "Action" },
  ];
  rooms: any[] = [];

  refreshingRoomList = false;
  pollingIntervalId = 0;

  get constants() {
    return Constants;
  }

  get isBanned() {
    return this.$store.state.user.isBanned;
  }

  async created() {
    setTimeout(this.refreshRoomList, 100);
    this.pollLobbyRooms();
  }

  async beforeDestroy() {
    if (this.pollingIntervalId != 0) {
      clearInterval(this.pollingIntervalId);
    }
  }

  async pollLobbyRooms() {
    this.pollingIntervalId = window.setInterval(async () => {
      await this.refreshRoomList();
    }, 5 * 1000);
  }

  async refreshRoomList() {
    this.refreshingRoomList = true;
    const roomList = await this.$client.getAvailableRooms(LOBBY_NAME);
    this.rooms = roomList.map((room: any) => {
      return {
        id: room.roomId,
        leader: room.metadata.leader,
        numClients: room.clients,
        dateCreated: room.metadata.dateCreated,
      };
    });
    setTimeout(() => {
      this.refreshingRoomList = false;
    }, 500);
  }

  async joinFullestRoom() {
    let mostClients = 0;
    let fullestRoomId = "";
    for (const room of this.rooms) {
      if (room.numClients > mostClients) {
        mostClients = room.numClients;
        fullestRoomId = room.id;
      }
    }
    if (fullestRoomId) {
      this.$emit("joinRoom", fullestRoomId);
    } else {
      this.$emit("createRoom");
    }
  }
}
</script>

<style lang="scss" scoped></style>
