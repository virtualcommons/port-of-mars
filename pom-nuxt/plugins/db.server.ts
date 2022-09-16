import "reflect-metadata";
import { AppDataSource } from "@/ormconfig";

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
