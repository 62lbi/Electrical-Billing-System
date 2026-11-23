//load library from express
const express = require('express');

//initiate object that instance of express
const router = express.Router();

//load payment's controller
const paymentController = require('../controllers/payment.controller');

//load multer/upload controller
const upload = require('../controllers/upload');

const {verifyToken, isAdmin, isCustomer} = require('../middlewares/auth.middlewares')

//placing the routes for referencing the controllers functions
router.get('/', verifyToken, isAdmin, paymentController.getAllPayments);
router.post('/', verifyToken, isCustomer, upload.single('payment_proof'), paymentController.createPayment);
router.patch('/:id/verify', verifyToken, isAdmin, paymentController.verifyPayment);

module.exports = router;