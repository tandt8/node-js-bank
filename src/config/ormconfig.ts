// src/ormconfig.ts
import { DataSource } from "typeorm";
import { ImportBatchEntity } from "../infrastructure/orm/entities/ImportBatchEntity";
import { TransactionEntity }   from "../infrastructure/orm/entities/TransactionEntity";
import { UserEntity }          from "../infrastructure/orm/entities/UserEnity";  // if you have it
import { config } from 'dotenv';
import path from "path";
config({ path: path.resolve(process.cwd(), '.env.bank') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  // Entities
  entities: [
    ImportBatchEntity,
    TransactionEntity,
    UserEntity   // remove if you're not using users
  ],

  // Migrations configuration
  migrations: ["migrations/*.ts"],
  migrationsTableName: "migrations",

  // In dev you can enable auto-sync, but disable in production
  synchronize: false,
  logging: false,
});
