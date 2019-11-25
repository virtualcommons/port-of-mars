<template>
  <BContainer class="container-accomplishments">
    <BRow class="accomplishments-topbar">
      <div class="accomplishments-topbar-title">
        <p>Accomplishments</p>
      </div>
      <div class="accomplishments-topbar-button-container">
        <button
          type="button"
          name="button"
          @click="handleClick('available')"
          :class="activeView == 'available' ? 'btn-active' : ''"
        >
          A
        </button>
        <button
          type="button"
          name="button"
          @click="handleClick('inventory')"
          :class="activeView == 'inventory' ? 'btn-active' : ''"
        >
          I
        </button>
      </div>
    </BRow>

    <BRow class="accomplishment-cards">
      <BRow class="accomplishments-cards-available" v-if="activeView == 'available'">
        <div class="accomplishment-container" :style="{width:setWidth}" v-for="accomplishment in currentAccomplishments" :key="accomplishment.label">
          <CardAccomplishment :accomplishment='accomplishment'/>
          <button class="discard-button" :style="{display:canDiscard}" @click='handleDiscardAccomplishment(accomplishment)'>
            <img :src="require(`@/assets/trashIcon.svg`)" />
          </button>
        </div>
      </BRow>

      <BRow class="accomplishments-cards-inventory" v-if="activeView == 'inventory'">
        <CardAccomplishment
          v-for="accomplishment in boughtAccomplishments"
          :key="accomplishment.label"
          :accomplishment="accomplishment"
        />
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishment from '@/components/gamedashboard/cards/CardAccomplishment.vue';
import { accomplishments } from '../../../../../server/src/data';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishment
  }
})
export default class ContainerAccomplishments extends Vue {
  private activeView = 'available';
  private isActive = true;
  private setWidth = '100%';

  get currentAccomplishments() {
    return this.$store.state.activeAccomplishmentCards;
  }

  get boughtAccomplishments() {
    return this.$store.state.boughtAccomplishmentCards;
  }

  get canDiscard(){
    let phase = this.$store.state.gamePhase;
    if(phase == "Purchase Investments"){
      this.setWidth = '95%';
      return '';
    } else{
      this.setWidth = '100%';
      return 'none';
    }
  }

  handleClick(view: string) {
    this.activeView = view;
  }

  handleDiscardAccomplishment(a){
    this.$root.$emit('openConfirmation', {text:`Select 'Yes' if you want to draw another card.`,
    type:'discardAccomplishment',
    actionData: a.label});
<<<<<<< HEAD
=======
    // this.$store.dispatch('discardAccomplishment',a.label);
>>>>>>> upstream/master
  }
}
</script>

<style scoped>
.accomplishment-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  /*width:95%;*/
  transition: all 0.3s ease-in-out;
}
.container-accomplishments {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0.5rem;
  padding-left: 0.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.accomplishments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  margin-bottom: 0.5rem;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--space-orange);
}

.accomplishments-topbar-title {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.accomplishments-topbar-title p {
  width: 100%;
  margin: 0;
  font-size: var(--font-med);
  text-align: center;
  color: var(--space-gray);
}

.accomplishments-topbar-button-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.accomplishments-topbar-button-container button {
  height: 2.5rem;
  width: 2.5rem;
  border: none;
  border-radius: 50%;
  margin: 0 0.25rem;
  font-size: var(--font-small);
  text-align: center;
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.accomplishments-topbar-button-container button:focus {
  outline: none;
}

.accomplishments-topbar-button-container button:hover {
  color: var(--space-white);
  background-color: var(--space-gray);
}

.btn-active {
  color: var(--space-white);
  background-color: var(--space-gray) !important;
}

.accomplishment-cards {
  height: 90%;
  width: 100%;
  margin: 0;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  background-color: var(--space-white-opaque-1);
}

.accomplishment-cards::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.accomplishments-cards-available,
.accomplishments-cards-inventory {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: var(--space-white-opaque-1); */
}

.accomplishments-cards-available {
  min-height: 100%;
  justify-content: space-around;
}

.accomplishments-cards-inventory {
  min-height: 100%;
  justify-content: space-around;
}

.discard-button{
  height: 2.5rem;
  width: 2.5rem;
  border: none;
  border-radius: 50%;
  text-align: center;
  background-color: white;
}
</style>
