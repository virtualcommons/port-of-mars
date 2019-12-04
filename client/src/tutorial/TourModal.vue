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
        no-close-on-backdrop="false"
        no-close-on-esc="false"
        no-enforce-focus="false"
    >
        <template v-slot:modal-title>
           <code><b>TUTORIAL</b></code>
        </template>
        <div class="d-block text-center">
            <h2><code><b>Welcome to Port of Mars!</b></code></h2>
            <p>You are 1 of 5 residents at <b>Port of Mars</b>, the first long-term habitat on the planet. 
            Your mission is to <b>stay alive</b> and <b>achieve the accomplishments</b> you came to Mars 
            to do. Each round, you have 10 timeblocks that you can invest in the maintenance of the shared 
            infrastructure <b>Upkeep</b> or buying influence currency in specific disciplines.</p>
            <br />
            <h4><b>OBJECTIVES</b></h4>
            <ul>
                <li>Keep <b>Upkeep</b> from reaching zero! If that happens, the habitat collapses, everyone dies, 
                    and the game is over.</li>
                <li>Earn points by achieving <b>Accomplishments</b>! Be the player with the most points at the end 
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
}
</script>

<style scoped>
</style>