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
  logging: false,
  entities: ["database/entities/**/*.ts"],
  migrations: ["database/migrations/**/*.ts"],
});

export const TestDataSource = new DataSource({
  name: "test",
  type: "postgres",
  host: "db",
  port: 5432,
  username: "marsmadness",
  database: "pom_testing",
  password: "DB_PASSWORD",
  synchronize: false,
  logging: false,
  entities: ["database/entities/**/*.ts"],
  migrations: ["database/migrations/**/*.ts"],
});