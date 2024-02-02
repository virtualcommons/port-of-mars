import { DataSourceOptions, DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const postgresConnectionOptions: DataSourceOptions = {
  type: "postgres",
  host: "db",
  port: 5432,
  username: "marsmadness",
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: false,
  entities: ["src/entity/**/*.{js,ts}"],
  migrations: ["src/migration/**/*.{js,ts}"],
};

const appDataSource = new DataSource({
  ...postgresConnectionOptions,
  database: "port_of_mars",
});

const testDataSource = new DataSource({
  ...postgresConnectionOptions,
  database: "pom_testing",
});

const dataSource = process.env.NODE_ENV === "test" ? testDataSource : appDataSource;
export default dataSource;
