import { QueryRunner, MigrationInterface } from "typeorm";

export class Migration1778036677475 implements MigrationInterface {
    name = 'Migration1778036677475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying(255) NOT NULL, "auth_id" character varying(255), "image" character varying(2048), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(3) NOT NULL, "symbol" character varying(8) NOT NULL, "name" character varying(128) NOT NULL, CONSTRAINT "UQ_118120c4e9964a883e848e3b104" UNIQUE ("key"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "identifier" character varying(255) NOT NULL, "icon" character varying(255), "exclude_from_stats" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "currency_id" uuid, "user_id" uuid, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(32) NOT NULL, "display_name_es" character varying(255) NOT NULL, CONSTRAINT "UQ_cdc9fa7ac37050d79a1555bf4ee" UNIQUE ("key"), CONSTRAINT "PK_2a49fe7879bf8a02812639cea61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "description" character varying(1024) NOT NULL, "record_date" TIMESTAMP WITH TIME ZONE NOT NULL, "exclude_from_stats" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_type_id" uuid, "currency_id" uuid, "account_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "icon" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_categories" ("transaction_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_c99c0ee879d0d7e6a02cb0a703c" PRIMARY KEY ("transaction_id", "category_id"))`);
        await queryRunner.query(`CREATE TABLE "rule_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "key" character varying(64) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bd1e99039a67e67e7a2d7584f56" UNIQUE ("key"), CONSTRAINT "PK_939527d5a6ad4b35b79007b0fe1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rule_bases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "key" character varying(64) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4d4c8aa1f76855cd14e1b3de129" UNIQUE ("key"), CONSTRAINT "PK_72317674fcbe9b779408b7fee85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rule_type_bases" ("rule_type_id" uuid NOT NULL, "rule_base_id" uuid NOT NULL, CONSTRAINT "PK_c03a30e87f7852479fb55da5f36" PRIMARY KEY ("rule_type_id", "rule_base_id"))`);
        await queryRunner.query(`CREATE TABLE "rules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "pattern" character varying(512) NOT NULL DEFAULT '', "excludes_from_stats" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rule_type_id" uuid, "rule_base_id" uuid, "source_account_id" uuid, "source_category_id" uuid, "source_transaction_type_id" uuid, "user_id" uuid, CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rule_categorization_targets" ("rule_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_78bbfaef39336d58e58430dc6f9" PRIMARY KEY ("rule_id", "category_id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_2b0d7a85ef19e9882a0e6587d8c" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_0088fd11d7d79f73d8824a10fcc" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_b515faccedf1dc36ac4f78acc04" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" ADD CONSTRAINT "FK_58995eaf5206ad5df3157cf310c" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" ADD CONSTRAINT "FK_ea6c71fe3807c111e6d8e8444df" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rule_type_bases" ADD CONSTRAINT "FK_845cd5cbaa529a83666dd6a8471" FOREIGN KEY ("rule_type_id") REFERENCES "rule_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rule_type_bases" ADD CONSTRAINT "FK_5d68cc6c5e4fab709155647212c" FOREIGN KEY ("rule_base_id") REFERENCES "rule_bases"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_c4698093205df9694ce2979db03" FOREIGN KEY ("rule_type_id") REFERENCES "rule_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_99f5bbe6658a67b52ea42195cb1" FOREIGN KEY ("rule_base_id") REFERENCES "rule_bases"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_984720d2607221688b3e59f6c27" FOREIGN KEY ("source_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_7eaa3255f4fa871a0a719320c10" FOREIGN KEY ("source_category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_6f6d61dc84203235a55f4b6fe20" FOREIGN KEY ("source_transaction_type_id") REFERENCES "transaction_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a25301750f8ef387215a9c6043b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rule_categorization_targets" ADD CONSTRAINT "FK_4f9cf7a730aae59a6380c7f952d" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rule_categorization_targets" ADD CONSTRAINT "FK_617436265e4d7e6fbe073cea540" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule_categorization_targets" DROP CONSTRAINT "FK_617436265e4d7e6fbe073cea540"`);
        await queryRunner.query(`ALTER TABLE "rule_categorization_targets" DROP CONSTRAINT "FK_4f9cf7a730aae59a6380c7f952d"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a25301750f8ef387215a9c6043b"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_6f6d61dc84203235a55f4b6fe20"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_7eaa3255f4fa871a0a719320c10"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_984720d2607221688b3e59f6c27"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_99f5bbe6658a67b52ea42195cb1"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_c4698093205df9694ce2979db03"`);
        await queryRunner.query(`ALTER TABLE "rule_type_bases" DROP CONSTRAINT "FK_5d68cc6c5e4fab709155647212c"`);
        await queryRunner.query(`ALTER TABLE "rule_type_bases" DROP CONSTRAINT "FK_845cd5cbaa529a83666dd6a8471"`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" DROP CONSTRAINT "FK_ea6c71fe3807c111e6d8e8444df"`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" DROP CONSTRAINT "FK_58995eaf5206ad5df3157cf310c"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_b515faccedf1dc36ac4f78acc04"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_0088fd11d7d79f73d8824a10fcc"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_2b0d7a85ef19e9882a0e6587d8c"`);
        await queryRunner.query(`DROP TABLE "rule_categorization_targets"`);
        await queryRunner.query(`DROP TABLE "rules"`);
        await queryRunner.query(`DROP TABLE "rule_type_bases"`);
        await queryRunner.query(`DROP TABLE "rule_bases"`);
        await queryRunner.query(`DROP TABLE "rule_types"`);
        await queryRunner.query(`DROP TABLE "transaction_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transaction_types"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
