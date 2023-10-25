import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1695342591570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                ALTER TABLE public.user
                    ADD unique(email);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('');
  }
}
