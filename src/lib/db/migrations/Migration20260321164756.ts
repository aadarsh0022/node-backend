import { Migration } from '@mikro-orm/migrations';

export class Migration20260321164756 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "is_deleted" boolean not null default false, "email" varchar(255) not null, "password" varchar(255) not null, "is_verified" boolean not null default false, "refresh_token" varchar(255) null, "role" varchar(255) not null default 'user', constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
