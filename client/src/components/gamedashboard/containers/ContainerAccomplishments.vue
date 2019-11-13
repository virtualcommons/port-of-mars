<template>
  <BContainer class="container-accomplishments" id="v-step-15">
    <BRow class="accomplishments-topbar">
      <p class="accomplishments-topbar-title">Accomplishments</p>
    </BRow>

    <BRow class="accomplishments-cards">
      <CardAccomplishment id="v-step-16" :accomplishment="currentAccomplishments[0]"/>
      <CardAccomplishment :accomplishment="currentAccomplishments[1]"/>
      <CardAccomplishment :accomplishment="currentAccomplishments[2]"/>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishment from '@/components/gamedashboard/cards/CardAccomplishment.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishment,
  },
})
export default class ContainerAccomplishments extends Vue {
  get currentAccomplishments() {
    return this.$store.state.activeAccomplishmentCards;
  }
}
</script>

<style scoped>
.container-accomplishments {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

.accomplishments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 0.125rem solid var(--space-white);
  background-color: var(--space-orange);
}

.accomplishments-topbar-title {
  margin: 0;
  color: var(--space-gray);
  font-size: 1.5rem;
}

.accomplishments-cards {
  height: 90%;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
