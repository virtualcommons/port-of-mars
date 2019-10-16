<template>
    <LoginScreen />
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import LoginScreen from '@/components/LoginScreen.vue';

    @Component({
        components: {
            LoginScreen,
        },
    })

    export default class LoginPage extends Vue {};
</script>