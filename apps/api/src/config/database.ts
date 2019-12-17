import { getMetadataArgsStorage } from 'typeorm';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const migrations = join(__dirname, '..', 'migrations');

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: parseInt(process.env.TYPEORM_PORT || '5432'),
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [
    join(__dirname, '../**/*.{entity,view}{.ts,.js}'),
    ...getMetadataArgsStorage().tables.map(tbl => tbl.target),
  ],
  migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
  migrations: [join(migrations, '*{.ts,.js}')],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = databaseConfig;
