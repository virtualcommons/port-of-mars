<template>
    <BContainer>
        <BRow class="board">
            <BCol cols="2" class="blue">1 of 3</BCol>
            <BCol cols="8" class="green">1 of 3</BCol>
            <BCol cols = "2" class="blue">1 of 3</BCol>
        </BRow>
    </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

    @Component({
      components: {
        BContainer,
        BRow,
        BCol,
      },
    })

export default class GameDashboard extends Vue {}

</script>

<style scoped>
    .container {
        margin: 0;
        padding: 0 !important;
    }
    .board {
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
    }
    .green {
        margin: 0;
        padding: 0;
        background-color: green;
    }
    .blue {
        margin: 0;
        padding: 0;
        background-color: blue;
    }
</style>
