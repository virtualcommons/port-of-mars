<template>
  <div class="card-accomplishment" @click="handleClick">
    <div class="card-title">
      <p>{{accomplishment.label}}</p>
    </div>
    <div class="card-info-container">
      <div class="card-points">
        <p>Points</p>
        <p>{{accomplishment.victoryPoints}}</p>
      </div>
      <div class="card-cost">
        <p v-for="i in total" :key="i">
          <i :class='imageScale'></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component

export default class CardAccomplishment extends Vue {
  @Prop({ default: {} }) private accomplishment;

  private cardModalData: object = {
    card: 'accomplishment',
    payload: {},
  }

  private costs = ['upkeep', 'finance', 'legacy', 'government', 'culture', 'science'];

  total = this.costs.map((curr) => {
    const cost = Math.abs(this.accomplishment[[curr]]);
    const amount = [];
    for (let i = 0; i < cost; i += 1) {
      amount.push(curr);
    }
    return amount;
  }).reduce((prev, curr) => prev.concat(curr), [])

  imageScale = this.total.length > 6 ? 'fas fa-spinner fa-1x' : 'fas fa-spinner fa-2x';

  constructor() {
    super();
    console.log(this.total);
  }

  handleClick() {
    this.$root.$emit('openCard', this.cardModalData);
  }
}
</script>

<style scoped>
.card-accomplishment {
  color:white;
  height: 7rem;
  width: 80%;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
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
