import path from 'path'
import { DataSource } from 'typeorm'
import { DATABASE_URL, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './envConfig'

const common = {
  type: 'postgres' as const,
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: ['dist/src/migrations/*.js'],
  logging: false,
  synchronize: false
}

export const dataSource = new DataSource(
  DATABASE_URL
    ? { ...common, url: DATABASE_URL }
    : {
        ...common,
        host: DB_HOST,
        port: Number(DB_PORT) ?? 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
      }
)
