<template>
  <div class="card-accomplishment">
    <div class="card-title">
      <p>Do not throw away your shot</p>
    </div>
    <div class="card-info-container">
      <div class="card-points">
        <p>Points</p>
        <p>3</p>
      </div>
      <div class="card-cost">
        <p v-for="i in x" :key="i">
          <i class="fas fa-spinner fa-2x"></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class CardAccomplishment extends Vue {
  private x:number = 3;
}
</script>

<style scoped>
.card-accomplishment {
  color:white;
  height: 7rem;
  width: 90%;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.card-info-container{
  display:flex;
  width: 95%;
  margin-left:auto;
  margin-right: auto;
  justify-content: space-between;
}

.card-title{
  margin:0;
}

.card-points p{
  margin:0;
  height:40%;
}

.card-cost p{
  display:inline;
}

.card-cost i{
  margin-left: 0.4rem;
}
</style>
