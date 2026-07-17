import { QueryRunner, MigrationInterface } from "typeorm";

export class Migration1778712861295 implements MigrationInterface {
    name = 'Migration1778712861295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credit_card_brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(64) NOT NULL, "display_name_es" character varying(255) NOT NULL, CONSTRAINT "UQ_b0ffd6eca172986b56817e327ce" UNIQUE ("key"), CONSTRAINT "PK_aa1e5d480181051de674bcfc73a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "credit_card_tiers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(64) NOT NULL, "display_name_es" character varying(255) NOT NULL, CONSTRAINT "UQ_d9a383afbbc55e940d5b929d60e" UNIQUE ("key"), CONSTRAINT "PK_733b7f133ad75f3fc4f6554146f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "credit_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "last_six_digits" character varying(6) NOT NULL, "expiry_month" smallint NOT NULL, "expiry_year" smallint NOT NULL, "creditLimit" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, "brand_id" uuid, "tier_id" uuid, CONSTRAINT "PK_7749b596e358703bb3dd8b45b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "credit_card_id" uuid`);
        await queryRunner.query(`ALTER TABLE "credit_cards" ADD CONSTRAINT "FK_37766314c488d2c66a25df536c6" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "credit_cards" ADD CONSTRAINT "FK_7d16bc36a9cf8216ed70bab114b" FOREIGN KEY ("brand_id") REFERENCES "credit_card_brands"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "credit_cards" ADD CONSTRAINT "FK_9c7ff687fa135a7faeaf18d11f8" FOREIGN KEY ("tier_id") REFERENCES "credit_card_tiers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_f0da938718eb2a8b26e2fcb4cbe" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_f0da938718eb2a8b26e2fcb4cbe"`);
        await queryRunner.query(`ALTER TABLE "credit_cards" DROP CONSTRAINT "FK_9c7ff687fa135a7faeaf18d11f8"`);
        await queryRunner.query(`ALTER TABLE "credit_cards" DROP CONSTRAINT "FK_7d16bc36a9cf8216ed70bab114b"`);
        await queryRunner.query(`ALTER TABLE "credit_cards" DROP CONSTRAINT "FK_37766314c488d2c66a25df536c6"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "credit_card_id"`);
        await queryRunner.query(`DROP TABLE "credit_cards"`);
        await queryRunner.query(`DROP TABLE "credit_card_tiers"`);
        await queryRunner.query(`DROP TABLE "credit_card_brands"`);
    }

}
