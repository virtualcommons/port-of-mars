<template>
  <div>
    <b-button
      :variant="variant"
      size="sm"
      class="mr-2"
      v-b-modal="modalId"
    >{{ action }}</b-button>
    <b-modal
      :id="modalId"
      title="Are you sure?" 
      centered
      no-stacking
      header-bg-variant="primary"
      header-border-variant="primary"
      body-bg-variant="dark"
      footer-border-variant="dark"
      footer-bg-variant="dark"
      >
      <p class="my-4">
        <slot />
      </p>
      <template #modal-footer="{ cancel }">
        <b-button variant="secondary" @click="cancel">Cancel</b-button>
        <b-button
          variant="danger"
          @click="$emit('confirmed')"
        >Confirm</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ConfirmationModalButton extends Vue {
  @Prop()
  modalId!: string;

  @Prop()
  variant!: string;

  @Prop()
  action!: string;
}
</script>

<style lang="scss" scoped>
</style>