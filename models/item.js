const db = require('../db');

class Book {
    static async findAll({ page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;
        const query = `SELECT * FROM books LIMIT ${limit} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) FROM books`;

        try {
            const { rows } = await db.query(query);
            const countResult = await db.query(countQuery);
            const totalItems = parseInt(countResult.rows[0].count, 10);
            const totalPages = Math.ceil(totalItems / limit);

            return { rows, totalItems, totalPages };
        } catch (error) {
            console.error("Database query error:", error);
            throw error;
        }
    }
}

module.exports = Book;
