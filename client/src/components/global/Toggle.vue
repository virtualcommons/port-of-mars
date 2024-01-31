<template>
  <input v-bind="$attrs" v-on="$listeners" type="checkbox" class="toggle-input" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
export default class Toggle extends Vue {}
</script>

<style lang="scss" scoped>
.switch.square label .lever {
  width: 54px;
  height: 34px;
  border-radius: 0px;
}
.switch.square label .lever:after {
  width: 26px;
  height: 26px;
  border-radius: 0px;
  left: 4px;
  top: 4px;
}

.toggle-input {
  position: relative;
  appearance: none;
  width: 45px; /* Adjust the width as needed */
  height: 25px; /* Adjust the height as needed */
  background-color: #a49ca6; /* Background color when the toggle is off */
  border-radius: 2px; /* Square corners */
  cursor: pointer;
  outline: none;
}

.toggle-input:checked {
  background-color: rgb(95, 141, 75); /* Background color when the toggle is on */
}

.toggle-input::before {
  content: "";
  position: absolute;
  width: 20px; /* Width of the toggle button */
  height: 20px; /* Height of the toggle button */
  background-color: #fff; /* Color of the toggle button */
  border-radius: 5%; /* Make it a rounded square*/
  top: 3px; /* Adjust the vertical position */
  left: 3px; /* Adjust the horizontal position */
  transition: 0.3s; /* Transition for smooth animation */
}

.toggle-input:checked::before {
  transform: translateX(20px); /* Move the toggle button to the right when checked */
}
</style>
