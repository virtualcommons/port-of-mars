<template>
    <router-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'default-layout',
})

export default class DefaultLayout extends Vue {
}
</script>
