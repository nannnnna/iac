const express = require('express');
const roleCheck = require('../middleware/roleMiddleware');
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/itemController');
const router = express.Router();

// Получение всех книг с возможной фильтрацией, сортировкой и пагинацией
router.get('/books', getAllBooks);


router.get('/data_list', roleCheck('ROLE_LIST_VIEW'), getAllBooks);

module.exports = router;
