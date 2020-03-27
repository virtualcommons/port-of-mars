<template>
    <div class="trade-request-modal">
        <div class="trade-request-container">
            <div class="header">
                <h5>Request A Trade </h5>
            </div>
            <TradeRequest class="actions"/>
        </div>

        <div class="active-accomplishments-container">
            <div class="exit">
                <button
                    @click="handleExit"
                    type="button"
                    name="Close Button"
                    class="exit-button"
                >
                    <font-awesome-icon
                    :icon="['fas', 'times']"
                    size="lg"
                    class="close-icon"
                    />
                </button>
            </div>

            <div class="active-accomplishments-section">
                <div class="header">
                    <h5>Active Accomplishments</h5>
                </div>

                <div class="active-accomplishments">
                    <ContainerAccomplishmentsGeneral 
                    :accomplishmentSet="activeAccomplishments"
                    :isVisible="true"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TradeRequest from '@port-of-mars/client/components/newGameDashboard/bottom/trading/TradeRequestRework.vue'
import ContainerAccomplishmentsGeneral from '@port-of-mars/client/components/newGameDashboard/left/containers/ContainerAccomplishmentsGeneral.vue';

@Component({
    components:{
        TradeRequest,
        ContainerAccomplishmentsGeneral
    }
})
export default class TradeRequestModal extends Vue{

    get activeAccomplishments(){
        return this.$tstore.getters.player.accomplishments.purchasable;
    }

    handleExit(){
        this.$tstore.commit('SET_TRADE_REQUEST_MODAL_VISIBILITY', false);
    }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/modals/TradeRequestModal.scss';
</style>