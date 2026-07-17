import { QueryRunner, MigrationInterface } from "typeorm";

export class Migration1778204490759 implements MigrationInterface {
    name = 'Migration1778204490759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "auth_id" character varying(255)`);
    }

}
