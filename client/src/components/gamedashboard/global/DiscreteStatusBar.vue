<template>
    <div class="status-o">
        <div class="progress" v-for="n in 10" :key="n"/>
        <div class="fader" :style="{width:`${setWidth}%`}"/>
    </div>

</template>


<script lang="ts">
import { Vue, Component,Prop } from 'vue-property-decorator';

@Component({})
export default class DiscreteStatusBar extends Vue{
    @Prop({default:0}) private setWidth!:number;
    

}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/StatusBarDiscrete.scss';
</style>