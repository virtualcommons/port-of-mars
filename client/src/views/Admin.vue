<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop overflow-auto">
    <b-row no-gutters class="h-100 w-100 p-5">
      <b-col>
        <div class="h-100 w-100 p-4 my-2 mx-auto content-container">
          <p>hello</p>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class Admin extends Vue {}
</script>

<style lang="scss">
.overflow-auto {
  overflow: auto;
}
</style>
