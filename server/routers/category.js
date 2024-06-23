const express =  require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

router.get('/', categoryController.getAllCategory);
router.get('/:categoryId', categoryController.getCategoryById);
router.post('/', categoryController.addNewCategory);
router.delete('/:categoryId', categoryController.deleteCategory);
router.put('/:categoryId', categoryController.updateCategory)
router.patch('/:categoryId/status', categoryController.updateCategoryStatus)

module.exports = router;