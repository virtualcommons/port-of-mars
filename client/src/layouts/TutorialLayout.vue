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
      //  Profile.vue
      target: '#v-step-0',
      content: 'Welcome to Port of Mars, Curator! This is your profile. You can click here to learn more about your character.',
      params: {
        placement: 'right',
      },
    },
    {
      // ContainerRight.vue
      target: '#v-step-1',
      content: 'Your team members and scores are displayed here.',
      params: {
        placement: 'left',
      },
    },
    {
      // ContainerRight.vue > Chat
      target: '#v-step-2',
      content: 'You can communicate with your team members in this chat window throughout the game.',
      params: {
        placement: 'left',
      },
    },
    {
      // ContainerLeft.vue > <Round />
      target: '#v-step-3',
      content: 'The current round number will be displayed here. There is an indefinite number of rounds per game.',
      params: {
        placement: 'right',
      },
    },
    {
      // ContainerLeft.vue > <Notifcation />
      target: '#v-step-4',
      content: 'Notifications will be displayed here throughout gameplay.',
      params: {
        placement: 'bottom',
      },
    },
    {
      // ContainerLeft.vue > <MarsLog />
      target: '#v-step-5',
      content: 'After the notifications disappear, they will be logged in the Mars Log. This will display a history of events that have occured throughout the game for your reference.',
      params: {
        placement: 'right',
      },
    },
    {
      // ContainerTop.vue > <ContainerUpkeep />
      target: '#v-step-6',
      content: 'This bar represents Upkeep, your teams shared infrastructure. Each round the upkeep level declines due to wear and tear, and without any investment by the residents, the Upkeep will be reduced to zero in a few rounds.',
      params: {
        placement: 'bottom',
      },
    },
    {
      // Phase.vue
      target: '#v-step-7',
      content: 'The current phase of the round and timer are displayed here. Each phase allots players 5 minutes to do what they need to do. The timer starts to count down as soon as a phase starts.',
      params: {
        placement: 'bottom',
      },
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
