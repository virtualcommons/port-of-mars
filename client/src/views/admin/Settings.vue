<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="h-100 p-3">
      <b-row class="h-100 m-0">
        <b-col>
          <b-form class="mb-5" @submit="onSubmit" @reset="onReset">
            <div class="mb-4" id="general">
              <h4>General</h4>
              <hr class="my-2">
              <b-form-group
                id="max-connections-group"
                label="Max Connections"
                label-for="max-connections"
                description="The maximum number of clients that can connect to the game server at once."
              >
                <b-form-input class="custom-form-input"
                  id="max-connections"
                  type="number"
                  min="10" max="200"
                  v-model="form.maxConnections"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="mute-length-group"
                label="Default Mute Length (days)"
                label-for="mute-length"
                description="The length that a player is muted for when they are muted by an admin."
              >
                <b-form-input class="custom-form-input"
                  id="mute-length"
                  type="number"
                  min="1" max="30"
                  v-model="form.defaultDaysMuted"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="mb-4" id="scheduling">
              <h4>Scheduling</h4>
              <hr class="my-2">
              <b-form-group
                id="enable-scheduler-group"
                label=""
                label-for="enable-scheduler"
                description="When enabled, the server will automatically schedule games at the specified interval."
              >
                <b-form-checkbox switch
                  size="lg"
                  id="enable-scheduler"
                  v-model="form.isAutoSchedulerEnabled"
                >
                  Enable Auto-Scheduler
                </b-form-checkbox>
              </b-form-group>
              <b-form-group
                id="days-out-group"
                label="Days to Schedule For"
                label-for="days-out"
                description="The number of days into the future that the server will schedule games for."
              >
                <b-form-input class="custom-form-input"
                  id="days-out"
                  type="number"
                  min="1" max="7"
                  v-model="form.autoSchedulerDaysOut"
                  :disabled="!form.isAutoSchedulerEnabled"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="interval-group"
                label="Scheduling Interval (hours)"
                label-for="interval"
                description="Hours between each time the server will schedule games."
              >
                <b-form-select class="custom-form-input"
                  id="interval"
                  v-model="form.autoSchedulerHourInterval"
                  :options="intervalOptions"
                  :disabled="!form.isAutoSchedulerEnabled"
                  required
                >
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="before-offset-group"
                label="Lobby Open Before (minutes)"
                label-for="before-offset"
                description="The number of minutes BEFORE the scheduled game time that the lobby will open."
              >
                <b-form-input class="custom-form-input"
                  id="before-offset"
                  type="number"
                  min="1" max="45"
                  v-model="form.lobbyOpenBeforeOffset"
                  :disabled="!form.isAutoSchedulerEnabled"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="after-offset-group"
                label="Lobby Open After (minutes)"
                label-for="after-offset"
                description="The number of minutes AFTER the scheduled game time that the lobby will open."
              >
                <b-form-input class="custom-form-input"
                  id="after-offset"
                  type="number"
                  min="1" max="45"
                  v-model="form.lobbyOpenAfterOffset"
                  :disabled="!form.isAutoSchedulerEnabled"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="mb-4" id="lobby">
              <h4>Lobby</h4>
              <hr class="my-2">
              <b-form-group
                id="assignment-group"
                label="Group Assignment Interval (minutes)"
                label-for="assignment"
                description="The number of minutes between each time the server will attempt to form full 5-person groups."
              >
                <b-form-input class="custom-form-input"
                  id="assignment"
                  type="number"
                  min="1" max="15"
                  v-model="form.lobbyGroupAssignmentInterval"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="force-assignment-group"
                label="Forced Assignment Interval (minutes)"
                label-for="force-assignment"
                description="The number of minutes until the server will force any players into a group with bots. -1 to disable."
              >
                <b-form-input class="custom-form-input"
                  id="force-assignment"
                  type="number"
                  min="-1" max="45"
                  v-model="form.lobbyForceGroupAssignmentInterval"
                  required
                ></b-form-input>
              </b-form-group>
            </div>
            <b-button class="mr-2" type="submit" variant="success">Save</b-button>
            <b-button class="mr-2" type="reset" variant="primary">Reset</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DynamicSettingsData } from "@port-of-mars/shared/types";
import { AdminAPI } from "@port-of-mars/client/api/admin/request";

@Component({})
export default class Reports extends Vue {
  api!: AdminAPI;
  form: DynamicSettingsData = {
    isTournamentSignUpEnabled: false,
    isFreePlayEnabled: false,
    isAutoSchedulerEnabled: false,
    maxConnections: 0,
    defaultDaysMuted: 0,
    autoSchedulerDaysOut: 0,
    autoSchedulerHourInterval: 0,
    lobbyOpenBeforeOffset: 0,
    lobbyOpenAfterOffset: 0,
    lobbyGroupAssignmentInterval: 0,
    lobbyForceGroupAssignmentInterval: 0
  };

  intervalOptions = [
    { value: 1, text: "1 hour" },
    { value: 2, text: "2 hours" },
    { value: 3, text: "3 hours" },
    { value: 4, text: "4 hours" },
    { value: 6, text: "6 hours" },
    { value: 12, text: "12 hours"}
  ];

  async created() {
    this.api = new AdminAPI(this.$tstore, this.$ajax);
    await this.initialize();
  }

  async initialize() {
    await this.fetchSettings();
  }

  async fetchSettings() {
    const settings = await this.api.getSettings();
    Vue.set(this, "form", settings);
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.api.updateSettings(this.form).then(() => {
      this.$bvToast.toast("Settings updated successfully", {
        title: "Success",
        variant: "success",
        solid: true
      });
    }).catch((err) => {
      this.$bvToast.toast("Failed to update settings", {
        title: "Error",
        variant: "danger",
        solid: true
      });
    });
  }

  async onReset(e: Event) {
    e.preventDefault();
    await this.fetchSettings();
  }
}
</script>

<style lang="scss" scoped>
.custom-form-input {
  max-width: 500px;
  &:disabled {
    background-color: $light-shade-25;
  }
}
</style>