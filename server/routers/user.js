
const express =  require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.post('/signup', userController.userSignUp);
router.post('/login', userController.userLogin);
router.get('/', userController.getAllUser);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserInfo);
router.delete('/:userId', userController.deleteUserId);
router.patch('/:userId/status', userController.updateUserStatus);
router.patch('/:userId/password', userController.updateUserPassword);
router.post('/forgot-password/send-otp', userController.sendOtp);
router.post('/forgot-password/verify-otp', userController.verifyOtp);


module.exports = router;