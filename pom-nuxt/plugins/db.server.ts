import { DataSource } from "typeorm";
import { AppDataSource } from "@port-of-mars/nuxt/ormconfig.ts";


export default defineNuxtPlugin(async (nuxtApp) => {
  await AppDataSource.initialize();
  return {
    provide: {
      getDataSource: () => {
        return AppDataSource;
      },
      getManager: () => {
        return AppDataSource.manager;
      }
    },
  };
});
