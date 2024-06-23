const express =  require('express');
const router = express.Router();
const brandController = require('../controllers/brand');

router.get('/', brandController.getAllBrand);
router.get('/:brandId', brandController.getBrandById);
router.post('/', brandController.addNewBrand);
router.delete('/:brandId', brandController.deleteBrand);
router.put('/:brandId', brandController.updateBrand)
router.patch('/:brandId/status', brandController.updateBrandStatus)

module.exports = router;