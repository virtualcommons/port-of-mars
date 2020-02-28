import MasterComponent from '@/components/MasterComponent.vue';

export class EnvironmentMode {
    constructor() {
        this.mode = process.env.NODE_ENV;
    }

    mode: string | undefined;

    /**
     * Get current mode of the game.
     * @returns The mode of the game (production/development).
     */
    get environment(): string | undefined {
        console.log('ENVIRONMENT: ', this.mode);
        return this.mode;
    }
}
