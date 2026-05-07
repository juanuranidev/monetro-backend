import { QueryRunner, MigrationInterface } from 'typeorm';

const FALLBACK_ICON: string = '🏷️';

/**
 * Aligns `categories.icon` with application rules: required on create (matches TypeORM + domain after this change).
 */
export class Migration1778124000000 implements MigrationInterface {
  public readonly name: string = 'Migration1778124000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "categories" SET "icon" = $1 WHERE "icon" IS NULL OR TRIM(COALESCE("icon", '')) = ''`,
      [FALLBACK_ICON],
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "icon" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "icon" DROP NOT NULL`,
    );
  }
}
