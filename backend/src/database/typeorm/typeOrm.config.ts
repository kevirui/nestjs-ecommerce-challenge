import { config } from 'dotenv';
import { resolve } from 'path';
import { getEnvPath } from '../../common/helper/env.helper';
import { DataSourceOptions } from 'typeorm';

const envFilePath: string = getEnvPath(
  resolve(__dirname, '../..', 'common/envs'),
);
config({ path: envFilePath });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'ecommercedb',
  username: process.env.DATABASE_USER || 'hassan',
  password: process.env.DATABASE_PASSWORD || 'password',
  entities: [process.env.DATABASE_ENTITIES],
  migrations: ['dist/database/migration/history/*.js'],
  logger: 'simple-console',
  synchronize: true, // never use TRUE in production!
  logging: true, // for debugging in dev Area only
};
