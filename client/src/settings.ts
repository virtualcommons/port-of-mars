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
        console.log('GET ENVIRONMENT: ', this.environmentMode);
        return this.environmentMode;
    }

    /**
     * Set current environment of the game.
     * @param newEnvironment The current environment of the game.
     */
    set environment(newEnvironment: string | undefined) {
        console.log('SET ENVIRONMENT: ', newEnvironment);
        this.environmentMode = newEnvironment;
    }
}

