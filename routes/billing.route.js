//load library from express
const express = require('express')

//initiate object that instance of express
const router = express.Router()

//load electricityService's controller
const BillingController = require(`../controllers/billing.controller`)
const {verifyToken, isAdmin} = require(`../middlewares/auth.middlewares`)

//placing the routes for referencing the controllers functions
router.get(`/`, verifyToken, isAdmin, BillingController.getAllBillings)
router.get(`/:id`, verifyToken, BillingController.getBillingById)
router.post(`/`, verifyToken, isAdmin, BillingController.addBilling)
router.put(`/:id`, verifyToken, isAdmin, BillingController.updateBilling)
router.delete(`/:id`, verifyToken, isAdmin, BillingController.deleteBilling)

//exporting them so it could be accessed in index.js
module.exports = router