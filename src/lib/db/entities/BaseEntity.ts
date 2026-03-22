import { PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseEntity {
    @PrimaryKey()
    id: string = uuidv4();

    @Property({ onCreate: () => new Date() })
    createdAt: Date = new Date();

    @Property({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt: Date = new Date();

    @Property({ default: false })
    isDeleted: boolean = false;
}