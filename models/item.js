const db = require('../db');

class Book {
    static async findAll({ filter = {}, sort = {}, page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM books WHERE 1=1`;

        // Добавление условий фильтрации
        if (filter.title) {
            query += ` AND title ILIKE '%${filter.title}%'`;
        }
        if (filter.description) {
            query += ` AND description ILIKE '%${filter.description}%'`;
        }

        // Сортировка
        if (sort.column && sort.direction) {
            query += ` ORDER BY ${sort.column} ${sort.direction}`;
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        const { rows } = await db.query(query);
        return rows;
    }

    // Получение одной книги по ID
    static async findById(id) {
        const { rows } = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        return rows[0];
    }

    // Создание новой книги
    static async create({ title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, tree_ref, image, blob_data }) {
        const { rows } = await db.query(
            `INSERT INTO books 
            (title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, tree_ref, image, blob_data) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, tree_ref, image, blob_data]
        );
        return rows[0];
    }

    // Обновление книги
    static async update(id, { title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, tree_ref, image, blob_data }) {
        const { rows } = await db.query(
            `UPDATE books SET 
            title = $2, description = $3, integer_attribute = $4, decimal_attribute = $5, date_attribute = $6, datetime_attribute = $7, simple_ref = $8, tree_ref = $9, image = $10, blob_data = $11 
            WHERE id = $1 RETURNING *`,
            [id, title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, tree_ref, image, blob_data]
        );
        return rows[0];
    }

    // Удаление книги
    static async delete(id) {
        const { rows } = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        return rows[0];
    }
}

module.exports = Book;
