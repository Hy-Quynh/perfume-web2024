const express =  require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal');

router.post('/pay', paypalController.payment);
router.get('/success', paypalController.paymentSuccess);
router.get('/cancel', paypalController.paymentCancel);

module.exports = router;