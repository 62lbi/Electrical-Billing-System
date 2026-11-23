//load library from express
const express = require('express')

//initiate object that instance of express
const router = express.Router()

//load electricityService's controller
const AccountController = require(`../controllers/electricityAccount.controller`)
const {verifyToken, isAdmin} = require('../middlewares/auth.middlewares')

//placing the routes for referencing the controllers functions
router.get(`/`, verifyToken, isAdmin, AccountController.getAllAccounts)
router.get(`/:id`, verifyToken, isAdmin, AccountController.getAccountById)
router.post(`/`, verifyToken, isAdmin, AccountController.addAccount)
router.put(`/:id`, verifyToken, isAdmin, AccountController.updateAccount)
router.delete(`/:id`, verifyToken, isAdmin, AccountController.deleteAccount)

//exporting them so it could be accessed in index.js
module.exports = router