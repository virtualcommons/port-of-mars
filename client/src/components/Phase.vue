<template>
  <div class="phase">
    <p class="phase-title">Current Phase</p>
    <p><span class="phase-current">Invest</span>&nbsp;<span class="phase-time">5:00</span></p>
    <!-- phase-current will change on props -->
    <!-- phase-time will change on props (seperate component?) -->
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Phase extends Vue {}
</script>


<style scoped>
.phase {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
  font-size: 1.5rem;
}

.phase p {
  margin: 0;
}

.phase-title {
  color: #F5F5F5;
}

.phase-current {
  color: #C67B5C;
}

.phase-time {
  color: #C67B5C;
}
</style>
