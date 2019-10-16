<template>
    <div class="container-bottom">
        <p>hello there</p>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    export default class ContainerBottom extends Vue {};
</script>

<style scoped>
    .container-bottom {
        height: 100%;
        width: 100%;
        
        border: 1rem solid black;
    }
</style>