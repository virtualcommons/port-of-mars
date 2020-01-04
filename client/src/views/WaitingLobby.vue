<template>
  <div class="waiting-lobby-container">
    <div class="row waiting-lobby">
      <div class="row top">
        <div class="column-3 character">
          <div class="character-img-frame animated pulse slow infinite">
            <img class="character-img" src="@/assets/characters-large/Politician.png" alt="" />
          </div>
          <p>Politician</p>
        </div>
        <div class="column-9 right">
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
        </div>
      </div>
      <div class="row bottom">
        <div class="column-3 character">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Pioneer.png" alt="" />
          </div>
          <p>Pioneer</p>
        </div>
        <div class="column-3 character">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Entrepreneur.png" alt="" />
          </div>
          <p>Entrepreneur</p>
        </div>
        <div class="column-3 character">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Curator.png" alt="" />
          </div>
          <p>Curator</p>
        </div>
        <div class="column-3 character">
          <div class="character-img-frame">
            <img class="character-img" src="@/assets/characters-large/Researcher.png" alt="" />
          </div>
          <p>Researcher</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class WaitingLobby extends Vue {}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@/stylesheets/views/WaitingLobby.scss';
</style>
