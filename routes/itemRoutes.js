const express = require('express');
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/itemController');
const router = express.Router();

// Получение всех книг с возможной фильтрацией, сортировкой и пагинацией
router.get('/books', getAllBooks);

// Получение одной книги по ID
router.get('/books/:id', getBook);

// Создание новой книги
router.post('/books', createBook);

// Обновление книги
router.put('/books/:id', updateBook);

// Удаление книги
router.delete('/books/:id', deleteBook);

module.exports = router;