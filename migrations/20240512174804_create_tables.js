/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');

exports.up = async function(knex) {
    // Создание таблицы ролей
    await knex.schema.createTable('roles', function(table) {
        table.increments('id').primary();
        table.string('name', 255).unique().notNullable();
    });

    // Вставка ролей
    await knex('roles').insert([
        { name: 'ROLE_LIST_VIEW' },
        { name: 'ROLE_ADD' },
        { name: 'ROLE_EDIT' },
        { name: 'ROLE_DELETE' }
    ]);

    // Получение ролей для динамического создания столбцов
    const roles = await knex.select('id', 'name').from('roles');

    // Создание таблицы пользователей с динамическими столбцами
    await knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('full_name', 255).notNullable();
        table.string('login', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        roles.forEach(role => {
            table.boolean(`role_${role.id}`).defaultTo(true);
        });
    });

    // Продолжение создания остальных таблиц...
    await knex.schema.createTable('simple_ref', function(table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
    });

    let simpleRefs = [];
    for (let i = 1; i <= 10; i++) {
        simpleRefs.push({ name: `Category ${i}` });
    }
    await knex('simple_ref').insert(simpleRefs);

    await knex.schema.createTable('hierarchical_ref', function(table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.integer('parent_id').unsigned().references('id').inTable('simple_ref');
    });

    let hierarchicalRefs = [];
    for (let i = 1; i <= 5; i++) {
        hierarchicalRefs.push({ name: `Item ${2*i-1}`, parent_id: i });
        hierarchicalRefs.push({ name: `Item ${2*i}`, parent_id: i });
    }
    await knex('hierarchical_ref').insert(hierarchicalRefs);

    await knex.schema.createTable('books', function(table) {
        table.increments('id').primary();
        table.string('title', 255);
        table.text('description');
        table.integer('integer_attribute');
        table.decimal('decimal_attribute');
        table.date('date_attribute');
        table.timestamp('datetime_attribute');
        table.integer('simple_ref').unsigned().references('id').inTable('simple_ref');
        table.integer('hierarchical_ref').unsigned().references('id').inTable('hierarchical_ref');
        table.binary('image');
        table.binary('blob_data');
    });

    const books = Array.from({ length: 50 }, () => ({
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        integer_attribute: faker.datatype.number(),
        decimal_attribute: faker.finance.amount(),
        date_attribute: faker.date.past(),
        datetime_attribute: faker.date.recent(),
        simple_ref: faker.datatype.number({ min: 1, max: 10 }),
        hierarchical_ref: faker.datatype.number({ min: 1, max: 10 })
    }));
    await knex('books').insert(books);
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('books');
    await knex.schema.dropTableIfExists('hierarchical_ref');
    await knex.schema.dropTableIfExists('simple_ref');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('roles');
};