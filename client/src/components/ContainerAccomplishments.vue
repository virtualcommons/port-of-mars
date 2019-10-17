<template>
  <BContainer class="container-accomplishments">
    <BRow class="row-accomplishments">
      <BCol class="accomplishments" cols="7">
        <BRow class="row-accomplishments-title">
          <p>Active Accomplishments</p>
        </BRow>
        <BRow class="row-accomplishments-cards">
          <CardAccomplishment/>
          <CardAccomplishment/>
          <CardAccomplishment/>
        </BRow>
      </BCol>
      <BCol class="dummy" cols="5">
        <!-- will remove later -->
      </BCol>
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

export default class ContainerAccomplishments extends Vue {};
</script>

<style scoped>
.container-accomplishments {
  width: 100%;
  height: 40%;
  padding: 0;
  /* border: 0.25rem solid #F5F5F5; */
  color: #F5F5F5;
}

.row-accomplishments {
  height: 100%;
  width: 100%;
  margin: 0;
}

.accomplishments {
  background-color: black;
  padding: 1rem;
}

.dummy {
  background-color: purple;
  padding: 0rem;
}

.row-accomplishments-title {
  margin: 0;
  height: 20%;
  align-items: center;
}

.row-accomplishments-title p {
  font-size: 1.5rem;
  margin: 0;
}

.row-accomplishments-cards {
  width: 100%;
  height: 80%;
  margin: 0;
  justify-content: space-between;
  align-items: center;
}
</style>
