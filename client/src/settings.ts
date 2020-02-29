export class EnvironmentMode {
    constructor() {
        this.environmentMode = process.env.NODE_ENV;
    }

    environmentMode: string | undefined;

    /**
     * Get current environment of the game.
     * @returns The mode of the game (production/development).
     */
    get environment(): string | undefined {
        console.log('ENVIRONMENT: ', this.environmentMode);
        return this.environmentMode;
    }
}
