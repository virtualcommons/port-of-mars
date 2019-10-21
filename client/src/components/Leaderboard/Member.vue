<template>
  <div :style="style()" @click='handleClick' class="member">

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component

export default class Member extends Vue {

  
  @Prop({default:50})
  private setWidth!:Number;


  style(){
    return {width:  `${this.setWidth}%`};
  }

  handleClick(){
    this.$root.$emit('openTrading', 'open');
  }
}
</script>

<style scoped>
.member {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 4.5rem;
  color: #F5F5F5;
  background-color: rgba(245, 245, 245, 0.2);
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
}
</style>
