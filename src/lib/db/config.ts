// src/config/mikro-orm.config.ts
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "./entities/User";
import "dotenv/config";


const config: Options<PostgreSqlDriver> = {
    driver: PostgreSqlDriver,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    entities: [User],
    debug: true,
    migrations: {
        path: "./src/lib/db/migrations", // folder
        pathTs: "./src/lib/db/migrations",
    },
};

export default config;