<template>
    <div class="modal-wrapper" v-show="showAnyModal">
        <div class="player-info-modal-wrapper" v-show="playerModalVisibility.visible">
            <PlayerInfoModal :role='playerModalVisibility.role' />
        </div>

        <div class="trade-request-modal-wrapper" v-show="tradeRequestModalVisibility.visible">
            <TradeRequestModal/>
        </div>

    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import PlayerInfoModal from './PlayerInfoModal.vue';
import TradeRequestModal from './TradeRequestModal.vue';
@Component({
    components:{
        PlayerInfoModal,
        TradeRequestModal
    }
})
export default class ModalConroller extends Vue{

    get showAnyModal(){
        return this.playerModalVisibility.visible || this.tradeRequestModalVisibility.visible;
    }

    get playerModalVisibility(){
        return this.$tstore.state.ui.modalViews.playerInfoModal;
    }

    get tradeRequestModalVisibility(){
        return this.$tstore.state.ui.modalViews.tradeRequestModal;
    }
}

</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/modals/ModalController.scss';
</style>