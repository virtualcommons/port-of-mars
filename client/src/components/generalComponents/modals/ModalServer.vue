<template>
  <div class="modal-server">
    <p class="title"><span>!!! </span>Message from Server<span> !!!</span></p>
    <p class="message">{{ modalData.text }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ModalServer extends Vue {
  @Prop({}) private modalData!: object;
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/generalComponents/modals/ModalServer.scss';
</style>
