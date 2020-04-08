<template>
    <div class="modal-wrapper" v-show="showAnyModal">
        <div class="player-info-modal-wrapper" v-show="playerModal.visible">
            <PlayerInfoModal :role='playerModal.role' />
        </div>

        <div class="trade-request-modal-wrapper" v-show="tradeRequestModal.visible">
            <TradeRequestModal/>
        </div>

        <div class="card-modal-wrapper" v-show="cardModal.visible">
            <ModalContainer :modalView="cardModal.data.type" :modalData="cardModal.data.info"/>
        </div>

    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import PlayerInfoModal from './PlayerInfoModal.vue';
import TradeRequestModal from './TradeRequestModal.vue';
import ModalContainer from './ModalContainer.vue';
@Component({
    components:{
        PlayerInfoModal,
        TradeRequestModal,
        ModalContainer,
    }
})
export default class ModalController extends Vue{

    get showAnyModal(){
        return this.playerModal.visible 
        || this.tradeRequestModal.visible
        || this.cardModal.visible;
    }

    get playerModal(){
        return this.$tstore.state.ui.modalViews.playerInfoModal;
    }

    get tradeRequestModal(){
        return this.$tstore.state.ui.modalViews.tradeRequestModal;
    }

    get cardModal(){
        console.log(this.$tstore.state.ui.modalViews.cardModal);
        return this.$tstore.state.ui.modalViews.cardModal;
    }
}

</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalController.scss';
</style>