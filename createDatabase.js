require('dotenv').config();
const { Pool } = require('pg');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

async function createDatabase() {
    const adminPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

    try {
        await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created successfully.`);
    } catch (error) {
        console.error('Error creating database:', error);
        if (error.code !== '42P04') {
            throw error;
        }
    } finally {
        await adminPool.end();
    }
}

async function runMigrations() {
    try {
        await knex.migrate.latest();
        console.log('Migrations have been run successfully.');
    } catch (error) {
        console.error('Failed to run migrations:', error);
    } finally {
        await knex.destroy();
    }
}

createDatabase()
    .then(runMigrations)
    .catch(error => console.error('Error in database setup:', error));