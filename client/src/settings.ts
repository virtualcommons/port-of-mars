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

const DEFAULT_BUILD_ID = "v2020.05";

export async function getBuildId() {
  try {
    const buildIdModule = await import("@port-of-mars/client/assets/build-id.json");
    return buildIdModule.default;
  }
  catch (e) {
    return DEFAULT_BUILD_ID;
  }
}