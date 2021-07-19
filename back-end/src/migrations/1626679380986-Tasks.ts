import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tasks1626679380986 implements MigrationInterface {
  name = 'Tasks1626679380986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "finishedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "finishedAt"`);
  }
}
