import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: "db",
  port: 5432,
  username: "marsmadness",
  database: "port_of_mars",
  password: "DB_PASSWORD",
  synchronize: false,
  logging: true,
  entities: ["database/entities/**/*.ts"],
  migrations: ["database/migrations/**/*.ts"],
});
