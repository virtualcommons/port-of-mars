<template>
  <div class="cm-transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="cm-wrapper">
      <BRow class="cm">
        <button class="cm-close-button" @click="closeModal">Close</button>
        <component
          :is="this.cardD.card === 'accomplishment' ? 'CardAccomplishmentView' : 'CardEventView'"
          :cardData="cardD.payload"
        ></component>
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
    CardEventView
  }
})
export default class CardModal extends Vue {
  setStyle: string = 'none';
  cardD = {};

  mounted() {
    this.$root.$on('openCard', (data: any) => {
      this.cardD = data;
      this.setStyle = '';
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.cm-transparent-wrapper {
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
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
  height: 26.375rem;
  width: 37.5rem;
  padding: 1rem 2rem;
  margin: 0;
  border: var(--border-white);
  border-radius: 1.25rem;
  position: relative;
  color: var(--space-white);
  background-color: var(--space-gray);
  overflow: hidden;
}

.title {
  width: 100%;
  border: none;
  position: relative;
  z-index: 4;
  top: 2rem;
  right: 2rem;
  text-decoration: underline;
  color: var(--space-white);
  background: none;
}

.card-info {
  width: 100%;
  border: none;
  position: relative;
  z-index: 4;
  top: 0.3rem;
  left: 1rem;
  color: var(--space-white);
  background: none;
}

.accomplishment-cost {
  margin-left: auto;
  margin-right: auto;
}

.cm-close-button {
  border: none;
  position: absolute;
  z-index: 4;
  top: 2rem;
  right: 2rem;
  text-decoration: underline;
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
