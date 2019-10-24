<template>
  <BContainer class="container-accomplishments">
    <BRow class="accomplishments-topbar">
      <p class="accomplishments-topbar-title">Accomplishments</p>
    </BRow>

    <BRow class="accomplishments-cards">
      <CardAccomplishment/>
      <CardAccomplishment/>
      <CardAccomplishment/>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishment from '@/components/CardAccomplishment.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishment,
  },
})

export default class ContainerAccomplishments extends Vue {}
</script>

<style scoped>
.container-accomplishments {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.accomplishments-topbar {
  height: 10%;
  margin: 0;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 0.125rem solid #F5F5F5;
  background-color: #C67B5C;
}

.accomplishments-topbar-title {
  margin: 0;
  color: #1E2223;
  font-size: 1.5rem;
}

.accomplishments-cards {
  height: 90%;
  margin: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
