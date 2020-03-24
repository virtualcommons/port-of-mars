<template>
  <div class="c-phaseinstructions">
    <div class="wrapper">
      <p class="title">Phase Instructions</p>
      <div class="instructions">
        <div class="text">
          <p>
            Integer vitae dignissim lorem. Integer orci lorem, pellentesque
            bibendum imperdiet eu, finibus eu ante. Vestibulum egestas quam
            vitae porta auctor. Aliquam id felis et sem auctor pulvinar. In
            pharetra facilisis justo vitae posuere. Nunc et rhoncus diam, at
            scelerisque arcu. Ut ante nunc, porta mattis sodales et, cursus a
            magna. Pellentesque lectus est, condimentum non pretium ut,
            vulputate sed nibh. Aliquam finibus nisl lacinia metus aliquam
            lobortis. Mauris et dolor malesuada, convallis dolor id, bibendum
            magna. Nulla facilisis porttitor arcu, sit amet ullamcorper dolor
            varius non. Quisque bibendum erat non velit sagittis auctor. Aliquam
            in ante semper, fringilla mi vehicula, fringilla metus. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Donec dictum
            congue magna. Sed eu placerat orci, at elementum lectus. Proin
            vehicula, enim vel pellentesque mollis, diam dolor aliquet dolor,
            sed finibus mi libero eget mauris. Vestibulum tellus erat, facilisis
            a ipsum eget, ultrices viverra purus. Mauris laoreet leo sapien, et
            dictum nisi luctus in. Proin scelerisque lorem id ex rutrum, sed
            fringilla sapien rutrum.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PhaseInstructions extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/PhaseInstructions.scss';
</style>
