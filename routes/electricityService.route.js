//load library from express
const express = require('express')

//initiate object that instance of express
const router = express.Router()

//load electricityService's controller
const ServiceController = require(`../controllers/electricityService.controller`)
const {verifyToken, isAdmin} = require('../middlewares/auth.middlewares')

//placing the routes for referencing the controllers functions
router.get(`/`, verifyToken, ServiceController.getAllServices)
router.get(`/:id`, verifyToken, ServiceController.getServiceById)
router.post(`/`, verifyToken, isAdmin, ServiceController.addService)
router.put(`/:id`, verifyToken, isAdmin, ServiceController.updateService)
router.delete(`/:id`, verifyToken, isAdmin, ServiceController.deleteService)

//exporting them so it could be accessed in index.js
module.exports = router