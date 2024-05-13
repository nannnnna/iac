const db = require('../db');

class Book {
    static async findAll({ page = 1, limit = 20, sort = { column: 'id', direction: 'asc' } , search = ''})  {
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM books WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) FROM books WHERE 1=1`;
        if (search) {
            query += ` AND (title ILIKE '%${search}%' OR description ILIKE '%${search}%' OR integer_attribute::text ILIKE '%${search}%' OR decimal_attribute::text ILIKE '%${search}%' OR date_attribute::text ILIKE '%${search}%' OR datetime_attribute::text ILIKE '%${search}%' OR simple_ref::text ILIKE '%${search}%' OR hierarchical_ref::text ILIKE '%${search}%')`;
            countQuery += ` AND (title ILIKE '%${search}%' OR description ILIKE '%${search}%' OR integer_attribute::text ILIKE '%${search}%' OR decimal_attribute::text ILIKE '%${search}%' OR date_attribute::text ILIKE '%${search}%' OR datetime_attribute::text ILIKE '%${search}%' OR simple_ref::text ILIKE '%${search}%' OR hierarchical_ref::text ILIKE '%${search}%')`;
        }
        if (sort.column && sort.direction) {
            query += ` ORDER BY ${sort.column} ${sort.direction}`;
        }
        query += ` LIMIT ${limit} OFFSET ${offset}`;


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
    static async create(data) {
        const {
            title,
            description,
            integer_attribute,
            decimal_attribute,
            date_attribute,
            datetime_attribute,
            simple_ref,
            hierarchical_ref,
            image,
            blob_data
        } = data;
        const query = `
            INSERT INTO books 
            (title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, hierarchical_ref, image, blob_data) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [title, description, integer_attribute, decimal_attribute, date_attribute, datetime_attribute, simple_ref, hierarchical_ref, image, blob_data];
        try {
            const {rows} = await db.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating new book: ${error.message}`);
        }
    }
    static async deleteMultiple(ids) {
        const query = `DELETE FROM books WHERE id = ANY($1::int[]) RETURNING *;`;
        try {
            const { rows } = await db.query(query, [ids]);
            return rows;
        } catch (error) {
            throw new Error(`Error deleting books: ${error.message}`);
        }
    }
}

module.exports = Book;
