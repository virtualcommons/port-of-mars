<template>
  <router-view>
    <v-tour name="tutorial" :steps="steps"></v-tour>
  </router-view>
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
}
</script>
