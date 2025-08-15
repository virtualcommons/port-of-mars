<template>
  <b-row
    :style="getMessageColor(message)"
    class="h-auto w-100 my-1 flex-column justify-content-start"
    style="color: rgb(241, 224, 197); background-color: rgba(241, 224, 197, 0.05); font-size: 1rem"
  >
    <b-col align-self="end">
      <!-- role of sender (e.g. Curator) -->
      <p class="mb-0 mx-2 mt-2 text-uppercase" style="color: rgb(202, 166, 110); font-weight: bold">
        {{ message.role }}<span v-if="showUsername"> [{{ username }}]</span>
      </p>
      <!-- message of sender -->
      <p class="mx-2" style="word-wrap: break-word">
        {{ message.message }}
      </p>
      <!-- timestamp -->
      <p v-if="showTimestamp" class="mb-2 mx-2">[ {{ toDate(message.dateCreated) }} ]</p>
      <slot></slot>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ChatMessageData } from "@port-of-mars/shared/types";
import { Role } from "@port-of-mars/shared/types";

@Component({})
export default class ChatMessage extends Vue {
  @Prop()
  message!: ChatMessageData;
  @Prop({ default: false })
  showUsername!: boolean;
  @Prop({ default: true })
  showTimestamp!: boolean;

  get username() {
    return this.$tstore.state.players[this.message.role as Role].username;
  }

  toDate(unixTimestamp: number): any {
    return new Date(unixTimestamp).toLocaleTimeString();
  }

  getMessageColor(message: ChatMessageData): object {
    if (message.role) {
      if (message.role === "Auditor") {
        return { backgroundColor: "var(--marslog-green)" };
      }
      return { backgroundColor: `var(--color-${message.role})` };
    }
    return { backgroundColor: "var(--light-shade-05)" };
  }
}
</script>

<style lang="scss" scoped></style>
