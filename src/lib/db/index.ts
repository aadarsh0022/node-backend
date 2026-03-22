import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import config from "./config";

export let orm: MikroORM<PostgreSqlDriver>;

export const initORM = async () => {
    orm = await MikroORM.init(config);
    return orm;
};
