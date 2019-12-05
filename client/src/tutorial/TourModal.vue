<template>
    <BModal 
        size="lg"
        id="bv-modal" 
        centered title="Port of Mars Tutorial" 
        hide-footer
        :header-bg-variant="headerBgVariant"
        :header-text-variant="headerTextVariant"
        :body-bg-variant="bodyBgVariant"
        :body-text-variant="bodyTextVariant"
        :no-close-on-backdrop="false"
        :no-close-on-esc="false"
        @hide="hideModal"
    >
        <template v-slot:modal-title>
           <code><b>TUTORIAL</b></code>
        </template>
        <div class="d-block text-center">
            <h2><code><b>WELCOME TO PORT OF MARS!</b></code></h2>
            <p>You are 1 of 5 residents at <code><b>Port of Mars</b></code>, the first long-term habitat on Mars. 
            Your mission is to <code><b>stay alive</b></code> and <code><b>achieve the accomplishments</b></code>. 
            Each round, you have <code><b>10 timeblocks</b></code> that you can invest in the maintenance of the shared 
            infrastructure called <code><b>Upkeep</b></code> or buying  <code><b>influence</b></code> currency in specific disciplines.</p>

            <p><code><b>Upkeep</b></code> is needed to keep everyone alive.</p> 
            
            <p><code><b>Influence</b></code> is what you use to buy <code><b>Accomplishments</b></code>, which is how you win the game.</p>

            <br />

            <h4><b>OBJECTIVES</b></h4>
            <ul>
                <li>Keep <code><b>Upkeep</b></code> from reaching zero! If that happens, the habitat collapses, everyone dies, 
                    and the game is over.</li>
                <li>Earn points by achieving <code><b>Accomplishments</b></code>! Be the player with the most points at the end 
                of the game to win.</li>
            </ul>
        </div>
    </BModal>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { BModal, BButtonClose } from 'bootstrap-vue';

@Component({
    components: {
        BModal,
        BButtonClose,
    }
})

export default class TourModal extends Vue {

    variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'];

    headerBgVariant: string = 'dark';
    headerTextVariant: string ='light';
    bodyBgVariant: string = 'dark';
    bodyTextVariant: string = 'light';

    /**
     * hideModal() method
     * Emits a custom event on hide.
     */
    hideModal() {
        this.$emit('hide');
    }
}
</script>

<style scoped>
code {
    color: #4AF626;
}
</style>
