import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
    @Property()
    @Unique()
    email!: string;

    @Property()
    password!: string;

    @Property({ default: false })
    isVerified: boolean = false;

    @Property({ nullable: true })
    refreshToken?: string;

    @Property({ default: "user" })
    role: "user" | "admin" = "user";
}