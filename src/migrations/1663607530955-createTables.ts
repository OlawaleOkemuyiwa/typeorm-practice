import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1663607530955 implements MigrationInterface {
    name = 'createTables1663607530955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_info" ("email" character varying(300) NOT NULL, "phone" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer, CONSTRAINT "REL_83e179dec93e66cdfa6b653405" UNIQUE ("client_id"), CONSTRAINT "PK_d6ab4c70d05da571e03f2cc3ff2" PRIMARY KEY ("email"))`);
        await queryRunner.query(`CREATE TYPE "transaction_type_enum" AS ENUM('deposit', 'withdraw')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "transaction_type_enum" NOT NULL, "amount" numeric(8,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" SERIAL NOT NULL, "first_name" character varying(200) NOT NULL, "last_name" character varying(200) NOT NULL, "card_number" character varying(10) NOT NULL, "pin" character varying NOT NULL, "balance" numeric(20,4) NOT NULL, "active" boolean NOT NULL DEFAULT true, "additional_info" text, "family_members" text NOT NULL DEFAULT '[]', "username" character varying(403) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9c924d8dc00b8e2dfbd7c849b37" UNIQUE ("first_name", "last_name"), CONSTRAINT "UQ_bc0c644bf2e06d38466b66ecd66" UNIQUE ("card_number"), CONSTRAINT "UQ_19385ccaeac3753e24d2eed6a4d" UNIQUE ("username"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("jwtToken" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "banker_id" integer, CONSTRAINT "PK_821f7d5c67b8869b506b30dc592" PRIMARY KEY ("jwtToken"))`);
        await queryRunner.query(`CREATE TABLE "banker" ("id" SERIAL NOT NULL, "first_name" character varying(200) NOT NULL, "last_name" character varying(200) NOT NULL, "email" character varying(300) NOT NULL, "employee_number" character varying(10) NOT NULL, "password" character varying NOT NULL, "yearly_salary" numeric(8,2) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "supervisor_id" integer, CONSTRAINT "UQ_3acd6699ffa812828bdc929a3f6" UNIQUE ("first_name", "last_name"), CONSTRAINT "UQ_c1944a58f7ecf3afbfe23173723" UNIQUE ("email"), CONSTRAINT "UQ_277df013559cb6637ad9a5fe312" UNIQUE ("employee_number"), CONSTRAINT "CHK_3177dd477bbe8cdc219ab4f5c7" CHECK ( "yearly_salary" > 0 ), CONSTRAINT "PK_3b517d2449b13a1a9b41c949e3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banker_client" ("banker_id" integer NOT NULL, "client_id" integer NOT NULL, CONSTRAINT "PK_16c72df13517f65014c2d271ff8" PRIMARY KEY ("banker_id", "client_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_576a0148f6618fac7116eb62a2" ON "banker_client" ("banker_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc23b5730f6196947ce76dd502" ON "banker_client" ("client_id") `);
        await queryRunner.query(`ALTER TABLE "contact_info" ADD CONSTRAINT "FK_83e179dec93e66cdfa6b6534053" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_3e4cf3f31643825f80f28f929e2" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_9ec7dcc78d6f8758e7f0ed421a8" FOREIGN KEY ("banker_id") REFERENCES "banker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "banker" ADD CONSTRAINT "FK_fa059894540c0568ee3002a9f7a" FOREIGN KEY ("supervisor_id") REFERENCES "banker"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "banker_client" ADD CONSTRAINT "FK_576a0148f6618fac7116eb62a26" FOREIGN KEY ("banker_id") REFERENCES "banker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "banker_client" ADD CONSTRAINT "FK_bc23b5730f6196947ce76dd5028" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banker_client" DROP CONSTRAINT "FK_bc23b5730f6196947ce76dd5028"`);
        await queryRunner.query(`ALTER TABLE "banker_client" DROP CONSTRAINT "FK_576a0148f6618fac7116eb62a26"`);
        await queryRunner.query(`ALTER TABLE "banker" DROP CONSTRAINT "FK_fa059894540c0568ee3002a9f7a"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_9ec7dcc78d6f8758e7f0ed421a8"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3e4cf3f31643825f80f28f929e2"`);
        await queryRunner.query(`ALTER TABLE "contact_info" DROP CONSTRAINT "FK_83e179dec93e66cdfa6b6534053"`);
        await queryRunner.query(`DROP INDEX "IDX_bc23b5730f6196947ce76dd502"`);
        await queryRunner.query(`DROP INDEX "IDX_576a0148f6618fac7116eb62a2"`);
        await queryRunner.query(`DROP TABLE "banker_client"`);
        await queryRunner.query(`DROP TABLE "banker"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "transaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
    }

}
