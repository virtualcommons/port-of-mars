<template>
  <b-container class="h-100 p-0 m-0" fluid>
    <b-row class="p-5 justify-content-center">
      <b-col cols="4">
        <Messages/>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col>
        <ConsentForm/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Messages from '@port-of-mars/client/components/dashboard/Messages.vue';
import ConsentForm from '@port-of-mars/client/components/dashboard/Consent.vue';

@Component({
  components: {Messages, ConsentForm}
})
export default class Register extends Vue {
}
</script>
