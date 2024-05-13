const db = require('../db');

class User {
    static async find(login) {
        const { rows } = await db.query('SELECT * FROM users WHERE login = $1', [login]);
        return rows[0];
    }

    static async create({ fullName, login, password }) {
        const { rows } = await db.query(
            'INSERT INTO users (full_name, login, password) VALUES ($1, $2, $3) RETURNING *',
            [fullName, login, password]
        );
        return rows[0];
    }
}

module.exports = User;
