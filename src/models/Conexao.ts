import { Pool } from "pg"; // usar PostgreSQL, ou troque para sqlite/mysql conforme preferência

export default class Conexao {
    protected static pool: Pool;

    static init() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        });
        return this.pool.connect();
    }

    protected static query(sql: string, params?: any[]) {
        return this.pool.query(sql, params);
    }
}
