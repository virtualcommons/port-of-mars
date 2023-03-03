<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="h-100 p-3">
      <b-row class="h-100 m-0">
        <b-col>
          <b-form class="mb-5" @submit="onSubmit" @reset="onReset">
            <div class="mb-4" id="general">
              <h4>General</h4>
              <hr class="my-2" />
              <b-form-group
                id="max-connections-group"
                label="Max Connections"
                label-for="max-connections"
                description="The maximum number of clients that can connect to the game server at once."
              >
                <b-form-input
                  class="custom-form-input"
                  id="max-connections"
                  type="number"
                  min="10"
                  max="200"
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
                <b-form-input
                  class="custom-form-input"
                  id="mute-length"
                  type="number"
                  min="1"
                  max="30"
                  v-model="form.defaultDaysMuted"
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
    maxConnections: 0,
    defaultDaysMuted: 0,
  };

  intervalOptions = [
    { value: 1, text: "1 hour" },
    { value: 2, text: "2 hours" },
    { value: 3, text: "3 hours" },
    { value: 4, text: "4 hours" },
    { value: 6, text: "6 hours" },
    { value: 12, text: "12 hours" },
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
    this.api
      .updateSettings(this.form)
      .then(() => {
        this.$bvToast.toast("Settings updated successfully", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      })
      .catch(() => {
        this.$bvToast.toast("Failed to update settings", {
          title: "Error",
          variant: "danger",
          solid: true,
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
