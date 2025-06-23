import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { UserEntity } from "./UserEnity";
import { TransactionEntity } from "./TransactionEntity";

@Entity("import_batches")
export class ImportBatchEntity {
  @PrimaryGeneratedColumn() id!: number;

  @Column() file_name!: string;
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "imported_by" })
  importedBy?: UserEntity;

  @Column({ type: "timestamptz", default: () => "NOW()" })
  imported_at!: Date;

  @Column() record_count!: number;
  @Column({ default: "pending" }) status!: string;
  @Column({ type: "text", nullable: true }) error_message?: string;

  @OneToMany(() => TransactionEntity, tx => tx.batch)
  transactions!: TransactionEntity[];
}
