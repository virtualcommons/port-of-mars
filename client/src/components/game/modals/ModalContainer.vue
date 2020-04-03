<template>
  <div class="modal-container">
    <div class="wrapper">
      <component :is="modalView" :modalData="modalData"></component>
      
      <button
        @click="handleClose"
        type="button"
        name="Close Button"
        class="modal-close"
      >
        <font-awesome-icon
          :icon="['fas', 'times']"
          size="lg"
          class="close-icon"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ModalCard from './ModalCard.vue';
import ModalConfirmation from './ModalConfirmation.vue';
import ModalServer from './ModalServer.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    ModalCard,
    ModalConfirmation,
    ModalServer
  }
})
export default class ModalContainer extends Vue {
  
  @Prop() modalView!:string;
  @Prop() modalData!:object;

  private handleClose(): void {
    //this.visible = false;
    this.$tstore.commit('SET_CARD_MODAL_VISIBILITY', {
      visible: false,
      data:{
        type:'',
        info:{
            card:'',
            payload:null
          },
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalContainer.scss';
</style>
