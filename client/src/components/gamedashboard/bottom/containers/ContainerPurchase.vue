<template>
    <div class="">
        <BarAccomplishment v-for="accomplishment in purchasableAccomplishments" :key="accomplishment.label+2" :accomplishment="accomplishment"/>
    </div>
</template>


<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'
import BarAccomplishment from '@/components/gamedashboard/global/cards/BarAccomplishment.vue';
@Component({
    components: {
        BarAccomplishment
    }
})
export default class ContainerPurchase extends Vue {
    
    
    get purchasableAccomplishments() {
        return this.$store.getters.player.accomplishment.purchasable;

    }

}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerPurchase.scss';
</style>