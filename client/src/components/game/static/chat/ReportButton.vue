<template>
  <div>
    <b-button
      squared
      v-b-tooltip.hover.top="'Report this player for violating the code of conduct'"
      v-b-modal="modalId"
      class="mb-2 mx-2 py-0 px-1"
      variant="outline-primary"
      size="sm"
      style="position: absolute; right: 0; bottom: 0;
        border-color: transparent; color: inherit;"
    >
      Report
    </b-button>
    <b-modal
      :id="modalId"
      title="Report this player"
      centered
      no-stacking
      header-bg-variant="primary"
      header-border-variant="primary"
      body-bg-variant="dark"
      footer-border-variant="dark"
      footer-bg-variant="dark"
    >
      <ReportModal :message="message" :showUsername="showUsername"></ReportModal>
      <template #modal-footer="{ cancel }">
        <b-button variant="secondary" @click="cancel">Cancel</b-button>
        <b-button variant="primary" @click="submitReport">Submit</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { url } from "@port-of-mars/client/util";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons/faPaperPlane";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ChatMessageData, ChatReportData, Role } from "@port-of-mars/shared/types";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";
import ReportModal from "@port-of-mars/client/components/game/modals/ReportModal.vue";

library.add(faPaperPlane);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    ChatMessage,
    ReportModal,
  }
})
export default class Chat extends Vue {
  @Prop() message!: ChatMessageData;
  @Prop({ default: false })
  showUsername!: boolean;

  get modalId() {
    return `report-modal-${this.message.role}-${this.message.dateCreated}`;
  }

  get username() {
    return this.$tstore.state.players[this.message.role as Role].username;
  }

  get submitReportUrl() {
    return url("/admin/submit-report");
  }

  async submitReport() {
    const formData: ChatReportData = {
      roomId: this.$ajax.roomId,
      username: this.username,
      message: this.message
    }
    await this.$ajax.post(
      this.submitReportUrl,
      (response) => {
        if (response.status === 200) {
          this.$bvModal.hide(this.modalId);
        }
      },
      formData
    );
  }
}
</script>

<style lang="scss" scoped>
</style>
