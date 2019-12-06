<template>
    <BContainer class="trade-container">
      <BRow>
        <BCol cols="12">
          <BRow>
            <BCol class="trade-data" cols="6">
              <BRow>
                <p>The {{ TEMP_OTHER_PLAYER }} would like:</p>
              </BRow>
              <BRow>
                <p class="investment-icon" v-for="investment in TEMP_OFFER_DATA" :key="investment + Math.random()">
                  <img style="width:2.5rem;" :src="require(`@/assets/iconsSVG/${investment}.svg`)" alt="Investment" />
                </p>
              </BRow>
              <BRow>
                <p>In exchange for:</p>
              </BRow>
              <BRow>
                <p class="investment-icon" v-for="investment in TEMP_EXCHANGE_DATA" :key="investment + Math.random()">
                  <img style="width:2.5rem;" :src="require(`@/assets/iconsSVG/${investment}.svg`)" alt="Investment" />
                </p>
              </BRow>
            </BCol>
            <BCol cols="6">
              <div class="person-flexbox">
                <div class="person-icon">
                  <img style="width:10rem;" :src="require(`@/assets/characters/${TEMP_OTHER_PLAYER}.png`)" alt="Investment" />
                </div>
                <div class="accept-reject-buttons">
                  <button class="incoming-trade-button">Accept</button>
                  <button class="incoming-trade-button">Reject</button>
                </div>
              </div>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
  </BContainer>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

//PUT THE ACCEPT/REJECT UNDER THE OTHER PLAYER ICON AND MAKE THE RIGHT SIDE THE
//SIDE TO INITIATE NEW TRADES
@Component({
  components: {
    BContainer,
    BRow,
    BCol,
  }
})
export default class Trade extends Vue {
  TEMP_OFFER_DATA = ['government','finance','legacy','legacy'];
  TEMP_EXCHANGE_DATA = ['science','science','science'];
  TEMP_OTHER_PLAYER = "Curator";


}
</script>

<style scoped>
.trade-container{
  border: 0.125rem solid var(--space-white-opaque-2);
}

.trade-data{
  padding-left:2rem;
}

.investment-icon{
  margin-right:0.5rem;
}

.incoming-trade-button{
  margin-left: 0.4rem;
}

.person-flexbox{
  display: flex;
  flex-wrap: wrap;
  text-align: right;
}

.person-icon{
  padding-top:0.5rem;
  width:100%;
}

.accept-reject-buttons{
  margin-top:2rem;
  width:100%;
}
</style>