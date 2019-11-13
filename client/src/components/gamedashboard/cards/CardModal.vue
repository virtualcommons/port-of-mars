<template>
  <div class="cm-transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="cm-wrapper">
      <BRow class="cm">
        <button class="cm-close-button" @click="closeModal">Close</button>
        <component
          :is="this.cardData.card === 'accomplishment' ? 'CardAccomplishmentView' : 'CardEventView'"
          :cardData="cardData.payload"
        ></component>
        <!-- <CardAccomplishmentView :cardData="cardData.payload" /> -->
      </BRow>
    </BContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishmentView from '@/components/gamedashboard/cards/CardAccomplishmentView.vue';
import CardEventView from '@/components/gamedashboard/cards/CardEventView.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishmentView,
    CardEventView,
  },
})
export default class CardModal extends Vue {
  setStyle: string = 'none';

  get cardData() {
    return this.$store.state.cardData;
  }

  switchView() {
    console.log(this.cardData.card); // eslint-disable-line no-use-before-define
    return this.cardData.card === 'accomplishment' ? 'CardAccomplishmentView' : 'CardEventView';
  }

  mounted() {
    this.$root.$on('openCard', (data: any) => {
      this.$store.dispatch('setCardModalData', data).then(() => {
        this.setStyle = '';
      });
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.cm-transparent-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 34, 35, 0.8);
}

.cm-wrapper {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.cm {
  position: relative;
  height: 26.375rem;
  width: 37.5rem;
  padding: 1rem 2rem;
  margin: 0;
  border: var(--border-white);
  border-radius: 1.25rem;
  color: var(--space-white);
  background-color: var(--space-gray);
  overflow: hidden;
}

.title {
  position: relative;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  width: 100%;
  border: none;
  text-decoration: underline;
  color: var(--space-white);
  background: none;
}

.card-info{
  position: relative;
  z-index: 2;
  top: 0.3rem;
  left:1rem;
  border: none;
  color: var(--space-white);
  background: none;
  width:100%;
}

.accomplishment-cost{
  margin-left: auto;
  margin-right:auto;
}

.cm-close-button {
  position: absolute;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  text-decoration: underline;
  border: none;
  color: var(--space-white);
  background: none;
}

.cm-close-button:hover {
  color: var(--space-orange);
}

.cm-close-button:active {
  outline: none;
}
</style>
