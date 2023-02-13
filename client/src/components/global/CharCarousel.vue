<template>
  <carousel-3d
    :perspective="35"
    :border="0"
    :width="250"
    :height="400"
    :autoplay="true"
    :autoplay-timeout="3000"
  >
    <slide :index="0">
      <img :src="require('@port-of-mars/client/assets/images/character-Curator.png')" />
    </slide>
    <slide :index="1">
      <img :src="require('@port-of-mars/client/assets/images/character-Entreprenuer.png')" />
    </slide>
    <slide :index="2">
      <img :src="require('@port-of-mars/client/assets/images/character-Pioneer.png')" />
    </slide>
    <slide :index="3">
      <img :src="require('@port-of-mars/client/assets/images/character-Politician.png')" />
    </slide>
    <slide :index="4">
      <img :src="require('@port-of-mars/client/assets/images/character-Researcher.png')" />
    </slide>
  </carousel-3d>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Carousel3d, Slide } from "vue-carousel-3d";

@Component({
  components: {
    Carousel3d,
    Slide,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
img {
  width: 250px;
  height: auto;
}

.carousel-3d-slide {
  background: transparent;
}
</style>
