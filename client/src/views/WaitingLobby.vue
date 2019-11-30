<template>
  <BContainer class="waiting-lobby-container">
    <BRow class="waiting-lobby">
      <BRow class="top">
        <BCol class="character" cols="3">
          <div class="character-img-frame animated pulse slow infinite">
            <img class="character-img" src="@/assets/characters-large/Politician.png" alt="" />
          </div>
          <p>Politician</p>
        </BCol>
        <BCol class="right" cols="9">
          <div class="hint-container">
            <div class="hint">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sollicitudin
                tortor sed sollicitudin pharetra. Nulla. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Pellentesque sollicitudin tortor sed sollicitudin pharetra. Nulla.
              </p>
            </div>
          </div>
          <div class="progress-container">
            <p class="progress-text">86<span>%</span></p>
            <!-- REMOVE LATER -->
            <router-link to="/game">
              <button class="game-btn">Continue to Game</button>
            </router-link>
            <!-- REMOVE LATER -->
          </div>
        </BCol>
      </BRow>
      <BRow class="bottom">
        <BCol class="character" cols="3">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Pioneer.png" alt="" />
          </div>
          <p>Pioneer</p>
        </BCol>
        <BCol class="character" cols="3">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Entrepreneur.png" alt="" />
          </div>
          <p>Entrepreneur</p>
        </BCol>
        <BCol class="character" cols="3">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Curator.png" alt="" />
          </div>
          <p>Curator</p>
        </BCol>
        <BCol class="character" cols="3">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Researcher.png" alt="" />
          </div>
          <p>Researcher</p>
        </BCol>
      </BRow>
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
    BCol
  }
})
export default class WaitingLobby extends Vue {}
</script>

<style scoped>
.waiting-lobby-container {
  height: 100vh !important;
  width: 100vw !important;
  max-width: none !important;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-gray);
}

.waiting-lobby {
  height: 100%;
  width: 100%;
  /* SET MAX SIZE OF SCREEN */
  max-height: var(--max-screen-height);
  max-width: var(--max-screen-width);
  /* SET MIN SIZE OF SCREEN */
  min-height: var(--min-screen-height);
  min-width: var(--min-screen-width);
  padding: 1rem;
  margin: 0;
  position: relative;
  display: flex;
  justify-content: center;
  background-color: var(--space-gray);
}

.top,
.bottom {
  height: 50%;
  width: 100%;
  color: var(--space-white);
}

.right {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
}

.hint-container {
  height: 7.5rem;
  width: 87.5%;
  margin-right: -1rem;
  border-bottom: 0.5rem solid var(--space-orange);
  border-radius: 0 0 0 0.5rem;
  display: flex;
}

.hint {
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  flex-grow: 1;
  background-color: var(--space-white-opaque-1);
}

.hint p {
  margin: 0;
  font-size: var(--font-med);
}

.progress-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.progress-text {
  margin: 0 4rem 0 0;
  font-size: 6rem;
  color: var(--space-orange);
}

.progress-text span {
  color: var(--space-white);
}

/* REMOVE LATER */

.game-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: var(--font-small);
  color: var(--space-white-opaque-2);
  background: transparent;
  transition: all 0.2s ease-in-out;
}

.game-btn:hover {
  color: var(--space-white);
  transform: scale(1.1);
}

.game-btn:active,
.game-btn:focus {
  outline: none;
}

/* REMOVE LATER */

.character {
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.character p {
  border-radius: 0 0 0.25rem 0.25rem;
  margin: 1rem 0 0 0;
  text-align: center;
  font-size: var(--font-med);
}

.character-img-frame {
  height: 0;
  width: 80%;
  padding: 40% 0;
  border-radius: 50%;
  position: relative;
  background-color: var(--space-orange);
}

.character-img {
  height: 87.5%;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
