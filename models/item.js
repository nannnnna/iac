const db = require('../db');

class Book {
    static async findAll({ filter = {}, sort = {}, page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM books WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) FROM books WHERE 1=1`;

        // Фильтрация
        if (filter.title) {
            const titleFilter = ` AND title ILIKE '%${filter.title}%'`;
            query += titleFilter;
            countQuery += titleFilter;
        }
        if (filter.description) {
            const descFilter = ` AND description ILIKE '%${filter.description}%'`;
            query += descFilter;
            countQuery += descFilter;
        }

        // Сортировка
        if (sort.column && sort.direction) {
            query += ` ORDER BY ${sort.column} ${sort.direction}`;
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        const { rows } = await db.query(query);
        const countResult = await db.query(countQuery);
        const totalItems = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalItems / limit);

        return { rows, totalItems, totalPages };
    }
}

module.exports = Book;
