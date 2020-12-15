<template>
    <b-container class="h-100 p-0 m-0" fluid>
      <b-row align-v="center" class="h-100 p-5">
        <b-col></b-col>
        <b-col align-self="center" cols="8">
          <b-row>
            <Messages />
          </b-row>
          <b-row>
            <ConsentForm />
          </b-row>
        </b-col>
        <b-col></b-col>
      </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Messages from '@port-of-mars/client/components/dashboard/Messages.vue';
import ConsentForm from '@port-of-mars/client/components/dashboard/Consent.vue';

@Component({
  components: { Messages, ConsentForm }
})
export default class Register extends Vue {}
</script>
