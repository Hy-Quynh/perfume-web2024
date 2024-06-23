const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.get('/', productController.getAllProduct);
router.get('/best-selling', productController.getBestSellingProduct);
router.get('/:productId', productController.getProductById);
router.post('/', productController.addNewProduct);
router.delete('/:productId', productController.deleteProduct);
router.put('/:productId', productController.updateProduct);
router.patch('/:productId/status', productController.updateProductStatus);

module.exports = router;
