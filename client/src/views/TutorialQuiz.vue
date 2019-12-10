<template>
    <div class="quiz-page">
        <div class="quiz-screen">
            <h1>QUIZ</h1>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})

export default class TutorialQuiz extends Vue {
}
</script>

<style>
.quiz-page {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
}

.quiz-screen {
    position: relative;
    z-index: 1;
    height: 80vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

h1 {
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-size: 11rem;
    font-weight: 700;
    color: var(--space-orange);
}
</style>