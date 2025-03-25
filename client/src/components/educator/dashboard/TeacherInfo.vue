<template>
  <div>
    <h4 class="font-weight-bold text-center mb-4" style="color: var(--light-shade)">
      Welcome to the teacher dashboard
    </h4>
    <p>
      The game is built on the premise that when people share a common resource, they will have to
      cooperate to manage it sustainably. You may be aware of the “tragedy of the commons”? The Port
      of Mars demonstrates the challenges of managing a shared resource, but it does not have to
      lead to a tragedy. Will your students overcome those challenges? And how does this relate to
      everyday challenges they experience?
    </p>
    <p>
      In the lesson plan
      <a
        href="https://docs.google.com/document/d/15VYUrirOInXZ1Dr9xTUSg-KjSycVFhwa0upMbi7mUyw/edit?usp=sharing"
        target="_blank"
        rel="noopener"
      >
        here</a
      >, we provide more background and suggestions for activities to do in class, including some
      assessment methods.
    </p>
    <p>
      To get started, you need to create a classroom. You will get a number that your students can
      use to log in. After joining with a game code, students will be prompted for an identifier. If
      you wish to be able to identify students, this can be anything you will be able to identify
      them by, such as a student ID. This should not, however, be any kind of personally
      identifiable information like full names. If the total number of students participating is not
      a multiple of five, some students will play with a group that includes nice bots.
    </p>
    <p>
      You control when the game starts. It would be helpful if the students watched the tutorial
      video and the manual. There might be some questions in the beginning since it is not easy to
      manage a habitat on Mars. The game typically lasts between 30 and 60 minutes.
    </p>
    <p>
      Once the games are played, you can see some basic statistics of the groups such as how system
      health changed over time, and how many points the different students earned. This can be used
      in a discussion with the students. Why did some groups manage to keep their habitat running
      for all the rounds while other groups had their system health dropping to 0 within a few
      rounds (game over)?
    </p>
    <p>
      We provide, at the moment, the most essential information for you to use the game in class.
      Depending on the requests we get, extensions will be made. Let us know if you have questions
      or suggestions, and send them to
      <a href="mailto:PORTMARS@ASU.EDU">PORTMARS@ASU.EDU</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TeacherInfo extends Vue {}
</script>

<style lang="scss" scoped></style>
