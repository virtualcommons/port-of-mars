<template>
<BModal></BModal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';

@Component({
    components: {
        BModal
    }
})

export default class ConsentFormModal extends Vue {
    consentGranted: boolean = false;

    async getConsent() {}

    async giveConsent() {}

    async denyConsent() {}

}

</script>

<style scoped></style>