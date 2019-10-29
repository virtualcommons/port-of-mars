<template>
  <div>
    <router-view />
    <v-tour name="gameTour" :steps="steps" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VueTour from 'vue-tour';

require('vue-tour/dist/vue-tour.css');

Vue.use(VueTour);

@Component({
  name: 'tutorial-layout',
})

export default class TutorialLayout extends Vue {
  steps = [
    {
      target: '#v-step-0',
      content: 'This is a test!',
    },
  ];

  /**
   * mounted() method
   * Starts the tour.
   *
   */
  mounted() {
    this.$tours.gameTour.start();
  }
}
</script>
