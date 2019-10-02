<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Socket } from 'vue-socket.io-extended';

    @Component
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
