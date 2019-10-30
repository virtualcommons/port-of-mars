<template>
  <BContainer>
    <BRow class="trading-modal" :style="{ display: setStyle }">
      <BCol class="trading-modal-members" cols="3">
        <TradingMember
          :playerRole="'Researcher'"
          :notificationCount="0"
          class="trading-modal-members-top trading-modal-members-seperator"/>
        <TradingMember
          :playerRole="'Curator'"
          :notificationCount="1"
          class="trading-modal-members-seperator"/>
        <TradingMember
          :playerRole="'Entrepreneur'"
          :notificationCount="2"
          class="trading-modal-members-seperator"/>
        <TradingMember
          :playerRole="'Pioneer'"
          :notificationCount="3"
          class="trading-modal-members-bottom"/>
      </BCol>
      <BCol class="trading-modal-content" cols="9">
        <button class="close-button" @click="handleClick()">Close</button>
        <TradeRequest />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import TradingMember from '@/components/containers/Trading/TradingMember.vue';
import TradeRequest from '@/components/containers/Trading/TradeRequest.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    TradingMember,
    TradeRequest,
  },
})

export default class TradingModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openTrading', (data: any) => {
      // Important: will need to set data type
      this.setStyle = '';
    });
  }

  handleClick() {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.trading-modal {
  width: 60rem;
  height: 30rem;
  background-color: #1e2223;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1.25rem;
  position: absolute;
  top: 50%;
  left: -200%;
  transform: translate(-50%, -50%);
}

.trading-modal-members {
  height: 100%;
  padding: 0;
  border-right: 0.125rem solid #F5F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* background-color: green; */
}

.trading-modal-content {
  height: 100%;
  padding: 0;
  position: relative;
  /* background-color: pink; */
}

.close-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
  text-decoration: underline;
  color: #F5F5F5;
  background: none;
  border: none;
}

.close-button:active {
  outline: none;
}


.trading-modal-members-top {
  border-top-left-radius: 1.25rem;
}

.trading-modal-members-bottom {
  border-bottom-left-radius: 1.25rem;
}

.trading-modal-members-seperator {
  border-bottom: 0.125rem solid #F5F5F5;
}
</style>
