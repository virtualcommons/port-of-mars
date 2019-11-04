<template>
  <div class="cm-transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="cm-wrapper">
      <BRow class="cm">
        <button class="cm-close-button" @click="closeModal">Close</button>
      </BRow>
    </BContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
  },
})

export default class CardModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openCard', (data: object) => {
      this.setStyle = '';
      if (data.type === 'event') {
        console.log('Modal: Event Card'); // eslint-disable-line no-use-before-define
      }
      if (data.type === 'accomplishment') {
        console.log('Modal: Accomplishment Card'); // eslint-disable-line no-use-before-define
      }
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.cm-transparent-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 34, 35, 0.8);
}

.cm-wrapper {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cm {
  position: relative;
  height: 26.375rem;
  width: 37.5rem;
  margin: 0;
  padding: 0;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1.25rem;
  background-color: #1e2223;
}

.cm-close-button {
  position: absolute;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  border: none;
  text-decoration: underline;
  color: #F5F5F5;
  background: none;
}

.cm-close-button:hover {
  color: #c67b5c;
}

.cm-close-button:active {
  outline: none;
}
</style>
