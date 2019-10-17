<template>
    <BContainer class="reset">
        <BRow class="board reset">
            <BCol cols="2" class="left reset">
              <!-- left section goes here -->
              <ContainerLeft />
            </BCol>
            <BCol cols="8" class="reset">
                <BRow class="top reset">
                  <ContainerTop />
                </BRow>
                <BRow class="bottom reset">
                    <ContainerBottom />
                </BRow>
            </BCol>
            <BCol cols="2" class="right reset">
              <!-- right section goes here -->
            </BCol>
        </BRow>
    </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerTop from '@/components/containers/ContainerTop.vue';
import ContainerBottom from '@/components/containers/ContainerBottom.vue';
import ContainerLeft from '@/components/containers/ContainerLeft.vue';

    @Component({
      components: {
        ContainerTop,
        ContainerBottom,
        ContainerLeft,
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
        background-color: #1E2223;
    }

    .right {
        background-color: green;
    }

    .top {
        height: 40vh;
        background-color: #1E2223;
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
