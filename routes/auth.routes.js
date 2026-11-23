//load library from express
const express = require('express');

//initiate object that instance of express
const router = express.Router();

//load auth's controller
const authController = require('../controllers/auth.controller')
const {verifyToken, isAdmin} = require('../middlewares/auth.middlewares')

//placing the routes for referencing the controllers functions
router.get('/', verifyToken, isAdmin, authController.getAllUser)
router.delete('/delete_user/:id', verifyToken, isAdmin, authController.deleteUser)
router.post('/register', authController.register);
router.post('/login', authController.login);

//works differently without middleware (will continue tomorrow, so customers could put their token and access their profile straight away)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;