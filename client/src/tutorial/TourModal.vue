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
           <code>Port of Mars Tutorial</code>
        </template>
        <div class="d-block text-center">
            <h3>Welcome to Port of Mars!</h3>
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