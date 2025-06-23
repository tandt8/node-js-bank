// src/infrastructure/orm/entities/UserEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { ImportBatchEntity } from "./ImportBatchEntity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Column({ type: "text" })
  password_hash!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  full_name?: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 20, default: "user" })
  role!: string;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  created_at!: Date;

  @OneToMany(() => ImportBatchEntity, batch => batch.importedBy)
  importBatches!: ImportBatchEntity[];
}
