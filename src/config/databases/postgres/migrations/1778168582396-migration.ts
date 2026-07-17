import { QueryRunner, MigrationInterface } from "typeorm";

export class Migration1778168582396 implements MigrationInterface {
    name = 'Migration1778168582396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "icon" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "icon" DROP NOT NULL`);
    }

}
