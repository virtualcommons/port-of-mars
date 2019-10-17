<template>
    <BContainer class="reset">
        <BRow class="board reset">
            <BCol cols="2" class="left reset"></BCol>
            <BCol cols="8" class="reset">
                <BRow class="top reset">

                </BRow>
                <BRow class="bottom reset">
                    <ContainerBottom />
                </BRow>
            </BCol>
            <BCol cols="2" class="right reset"></BCol>
        </BRow>
    </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerBottom from '@/components/containers/ContainerBottom.vue';

    @Component({
      components: {
        ContainerBottom,
        BContainer,
        BRow,
        BCol,
      },
    })

export default class GameDashboard extends Vue {}

</script>

<style scoped>
    .reset {
        margin: 0;
        padding: 0;
    }

    .board {
        height: 100vh;
        width: 100vw;
    }

    .left {
        background-color: blue;
    }

    .right {
        background-color: green;
    }

    .top {
        height: 40vh;
        background-color: pink;
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        height: 60vh;
        background-color: #1E2223;
    }
</style>
