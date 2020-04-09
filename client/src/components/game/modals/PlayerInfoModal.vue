<template>
    <div class="player-info-modal">
        <button
        @click="handleExit"
        type="button"
        name="Close Button"
        class="exit"
      >
        <font-awesome-icon
          :icon="['fas', 'times']"
          size="lg"
          class="close-icon"
        />
      </button>
        <div class="player-info" >
            <div class="role-icon">
                <div class="p-container">
                    <div class="frame-outer">
                        <div  class="frame-inner" :style="{'backgroundColor':`var(--color-${role})`}">
                        <img :src="require(`@port-of-mars/client/assets/characters/${role}.png`)" alt="Player" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="role-info">
                <h4 class="header-text">{{playerData.isSelf ? 'Your' : 'Player'}}
                     Information</h4>
                <div class="info-container">
                    <div class="info">
                        <h5 class="role-text">Role: <span class="color-mod">{{role}}</span></h5>
                        <h5 class="score">Score: <span class="color-mod">{{playerData.info.victoryPoints}}</span></h5>
                        <h5 class="place">Ranking: <span class="color-mod">{{ranking}}/5</span></h5>
                    </div>

                    <div class="request-trade" v-show="!playerData.isSelf">
                        <button v-bind="{class: playerData.isSelf ? 'trade-button-unavailable' : 
                            gamePhase == phase.trade ? 'trade-button-available' : 'trade-button-unavailable' }"
                            @click="handleRequestTrade"
                            >         
                            Request Trade</button>
                        <p v-bind="{class: errorMessageActive ? 'error-active' : 'error-inactive' }">
                            Trade Request cannot be completed
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="player-resources">
            <div class="player-inventory">
                <h4 class="header-text">Inventory</h4>
                <InventoryTable :playerData="playerData" :isVisible="playerData.isSelf || isUnderAudit"/>
            </div>

            <div class="player-accomplishments">
                <h4 class="header-text">Accomplishments</h4>
                <div class="accomplishment-wrapper">
                    <div class="active">
                        <p class="active-text">Active</p>
                        <ContainerAccomplishmentsGeneral
                            :accomplishmentSet="activeAccomplishments"
                            :isVisible="playerData.isSelf || isUnderAudit"
                            :showDescription="false"/>
                    </div>
                    <div class="purchased">
                        <p class="purchased-text">Purchased</p>
                        <ContainerAccomplishmentsGeneral
                            :accomplishmentSet="purchasedAccomplishments"
                            :isVisible="playerData.isSelf || isUnderAudit"
                            :showDescription="false"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import { Role, Phase } from '@port-of-mars/shared/types';
import InventoryTable from '@port-of-mars/client/components/game/InventoryTable.vue';
import ContainerAccomplishmentsGeneral from '@port-of-mars/client/components/game/accomplishments/ContainerAccomplishmentsGeneral.vue';


@Component({
    components:{
        InventoryTable,
        ContainerAccomplishmentsGeneral
    }
})
export default class ModalController extends Vue{
    @Prop() role!:Role;
    private errorMessageActive:boolean = false;

    get playerData(){
        return {
            info:this.$tstore.state.players[this.role],
            isSelf:this.role==this.$tstore.getters.player.role,
        }
        
    }

    get gamePhase(){
        return this.$tstore.state.phase;
    }

    get phase(){
        return Phase;
    }

    get ranking(){
        return Object.keys(this.$tstore.state.players).sort((a,b)=>{
            return this.$tstore.state.players[b as Role].victoryPoints-this.$tstore.state.players[a as Role].victoryPoints;
        }).indexOf(this.role) + 1;
    }

    get activeAccomplishments(){
        return this.playerData.info.accomplishments.purchasable;
    }

    get purchasedAccomplishments(){
        return this.playerData.info.accomplishments.purchased;
    }

    get isUnderAudit(){
        return this.$tstore.getters.isUnderAudit;
    }


    handleExit(){
        this.$tstore.commit('SET_PLAYER_INFO_MODAL_VISIBILITY',{
            role:'Researcher',
            visible:false
        });
        this.errorMessageActive = false;
    }

    handleRequestTrade(){
        if(!this.playerData.isSelf && this.gamePhase == this.phase.trade){
            this.$tstore.commit('SET_PLAYER_INFO_MODAL_VISIBILITY',{
                role:'Researcher',
                visible:false
            });
            this.$tstore.commit('OPEN_TRADE_MODAL_WARM',{role:this.role});
        } else {
            this.errorMessageActive = true;
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/PlayerInfoModal.scss';
</style>