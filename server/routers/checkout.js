
const express =  require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout');


router.post('/', checkoutController.checkoutCart);
router.get('/', checkoutController.getAllOrder);
router.get('/statistic', checkoutController.statisticOrder);
router.get('/user/:userId', checkoutController.getUserOrder);
router.get('/:checkoutId', checkoutController.getOrderDetail);
router.put('/:checkoutId/status', checkoutController.changeOrderStatus);

module.exports = router;