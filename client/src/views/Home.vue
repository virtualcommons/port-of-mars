<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { Socket } from 'vue-socket.io-extended';

@Component({
  components: {
    HelloWorld,
  }
})
export default class Home extends Vue {
  @Socket('joinGame')
  onJoinGame(data: unknown) {
    console.log(data);
  }

  mounted() {
    console.log((this as any).$socket);
    (this as any).$socket.client.emit('joinGame', { my: 'data' }); 
  }
}
</script>
