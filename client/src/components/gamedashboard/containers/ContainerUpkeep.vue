<template>
  <BContainer class="container-upkeep">
    <StatusBar class="upkeep-statusbar" :setWidth="`${upkeepStatus}`" />
    <p>
      Upkeep <span class="upkeep-status">{{ upkeepStatus }}</span
      >/100
    </p>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import StatusBar from '@/components/gamedashboard/StatusBar.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
  },
})
export default class ContainerUpkeep extends Vue {
  get upkeepStatus() {
    return this.$store.state.upkeep;
  }

  // simEvent() {
  //   this.$store
  //     .dispatch('changeUpkeepAmount', 25)
  //     .then(() => {
  //       this.$store.dispatch('setNotificationMessage', '-25 Upkeep');
  //     })
  //     .then(() => {
  //       this.$root.$emit('notification', '-25 Upkeep');
  //     });
  // }
}
</script>

<style scoped>
.container-upkeep {
  /* width: 80%; */
  width: 100%;
  height: 20%;
  padding: 0 0.5rem 1rem 0.5rem;
  max-width: none;
  /* background-color: green; */
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--space-white);
  /* background-color: purple; */
}

.container-upkeep p {
  width: 100%;
  text-align: center;
  margin: 0.5rem 0 0 0;
  font-size: 1.25rem;
}

.upkeep-statusbar {
  width: 80%;
  /* margin-top: 1rem; */
}

.upkeep-status {
  color: var(--space-orange);
}
</style>
