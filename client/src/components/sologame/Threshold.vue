<template>
    <div class="content-container p-2">
        <div v-if="state == 0"> <span class="ml-2"> UNKNOWN</span> </div>
        <div v-else-if="state == 1"> <span class="ml-2"> KNOWN</span> </div>
        <div v-else-if="state == 2"> <span class="ml-2"> RANGE</span> </div>    
    </div>
</template>
  
  <script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component
    export default class Threshold extends Vue {
        @Prop() state!: number;
    }   
  </script>
  
  <style lang="scss"></style>
  