import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class users1633691660873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true
                    },
                    {
                        name: "name",
                        type: 'varchar'
                    },
                    {
                        name: "email",
                        type: 'varchar'
                    },
                    {
                        name: "createdAt",
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
