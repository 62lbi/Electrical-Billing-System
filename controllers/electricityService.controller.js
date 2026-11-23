// load model of 'electricity_services.js'
const electricityServiceModel = require(`../models/index`).ElectricityService

//function to get all data of 'electricity service' from database
exports.getAllServices = async (req, res) => {
    try {
        const datas = await electricityServiceModel.findAll()
        return res.status(200).json({
            success: true,
            data: datas,
            message: "All services data successfully loaded."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get single electricity service by ID
exports.getServiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await electricityServiceModel.findByPk(id);

        if(!service) { //if service is not found
            return res.status(404).json({
                success: false,
                message: 'Service not found/ID does not exist'
            })
        } return res.status(200).json({ //if service is found and smoothly done
            success: true,
            data: service
        }) 
    } catch (error) { //server error
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// create a new electricity service
exports.addService = async (req, res) => {
    try {
        const {code, name, power_va, price_per_kwh, is_active} = req.body //listing the things that are needed for the customer to put in the body
        const newService = await electricityServiceModel.create({ //things that are going to be created (based on the line above)
            code,
            name,
            power_va,
            price_per_kwh,
            is_active
        })
        return res.status(201).json({
            success: true,
            message: 'Service created successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Please fill out code, name, power_va, price_per_kwh, is_active fully.'
        })
    }
}

//create function to update an electricity service data that already existed in the database
exports.updateService = async (req, res) => {
    try {
        const {id} = req.params
        const service = await electricityServiceModel.findByPk(id)

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'ID not found/please input the correct ID'
            })
        }
        await service.update(req.body)
        return res.status(200).json({
            success: true,
            message: 'Service updated succesfully'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//create function to delete an existing service data with its id
exports.deleteService = async (req, res) => {
    try {
        const {id} = req.params
        const service = await electricityServiceModel.findByPk(id)

        if(!service) {
            return res.status(404).json({
                success: false,
                message: 'The inputted ID does not exist'
            })
        }
        await service.destroy()
        return res.status(200).json({
            success: true,
            message: 'The inputted ID data is successfully deleted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

