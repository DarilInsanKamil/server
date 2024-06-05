const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const getPool = () => {
    const pool = new Pool({
        user: 'postgres',
        password: 'postgres',
        // host: '18.136.208.197',
        port: 5432,
        database: 'bookstore',
    });

    return pool;
};
export default getPool;
