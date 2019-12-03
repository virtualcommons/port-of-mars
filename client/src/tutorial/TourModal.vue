<template>
    <BModal id="bv-modal" ref= "bv-modal" hide-footer>
        <template v-slot:modal-title>
            Using <code>$bvModal</code> Methods
        </template>
        <div class="d-block text-center">
            <h3>This is a modal!</h3>
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

export default class TourModal extends Vue {}
</script>