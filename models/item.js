const db = require('../db');

class Book {
    static async findAll({ page = 1, limit = 20, sort = { column: 'id', direction: 'asc' } })  {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM books`;
        if (sort.column && sort.direction) {
            query += ` ORDER BY ${sort.column} ${sort.direction}`;
        }
        query += ` LIMIT ${limit} OFFSET ${offset}`;
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
