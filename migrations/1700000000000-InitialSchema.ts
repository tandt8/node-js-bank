import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE users (
                id            SERIAL PRIMARY KEY,
                username      VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT           NOT NULL,
                full_name     VARCHAR(100),
                email         VARCHAR(100) UNIQUE,
                role          VARCHAR(20)     NOT NULL DEFAULT 'user',
                created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
            )
        `);

        // Create import_batches table
        await queryRunner.query(`
            CREATE TABLE import_batches (
                id            SERIAL PRIMARY KEY,
                file_name     VARCHAR(255)    NOT NULL,
                imported_by   INTEGER         REFERENCES users(id) ON DELETE SET NULL,
                imported_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                record_count  INTEGER         NOT NULL,
                status        VARCHAR(20)     NOT NULL DEFAULT 'pending',
                error_message TEXT
            )
        `);

        // Create index for import_batches
        await queryRunner.query(`
            CREATE INDEX idx_import_batches_imported_at ON import_batches(imported_at DESC)
        `);

        // Create transactions table
        await queryRunner.query(`
            CREATE TABLE transactions (
                id                SERIAL PRIMARY KEY,
                batch_id          INTEGER       NOT NULL REFERENCES import_batches(id) ON DELETE CASCADE,
                transaction_date  TIMESTAMPTZ   NOT NULL,
                description       TEXT          NOT NULL,
                amount            NUMERIC(15,2) NOT NULL,
                type              VARCHAR(10)   NOT NULL CHECK (type IN ('Deposit','Withdraw')),
                created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
            )
        `);

        // Create indexes for transactions
        await queryRunner.query(`
            CREATE INDEX idx_transactions_batch_id ON transactions(batch_id)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_transactions_date ON transactions(transaction_date)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX idx_transactions_date`);
        await queryRunner.query(`DROP INDEX idx_transactions_batch_id`);
        await queryRunner.query(`DROP INDEX idx_import_batches_imported_at`);

        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE transactions`);
        await queryRunner.query(`DROP TABLE import_batches`);
        await queryRunner.query(`DROP TABLE users`);
    }
} 