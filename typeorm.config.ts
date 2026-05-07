import 'tsconfig-paths/register';
import 'reflect-metadata';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

/** Same resolution order as `ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] })`: local fills first, then `.env` for missing keys. */
dotenv.config({ path: join(__dirname, '.env.local') });
dotenv.config({ path: join(__dirname, '.env') });

const useDbSsl: boolean = process.env.DB_SSL === 'true';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'monetro',
  ssl: useDbSsl ? { rejectUnauthorized: false } : false,
  entities: [join(__dirname, 'src/**/*.typeorm-entity.{ts,js}')],
  migrations: [
    join(__dirname, 'src/config/databases/postgres/migrations/**/*.{ts,js}'),
  ],
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
});

export default AppDataSource;
