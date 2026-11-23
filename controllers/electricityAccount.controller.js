// load model of 'electricity_account.js'
const { ElectricityAccount } = require('../models');

// Get all electricity accounts
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await ElectricityAccount.findAll({
            include: ['user', 'electricityService']
        });

        return res.status(200).json({
            success: true,
            data: accounts,
            message: "All accounts successfully loaded."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single electricity account by ID
exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await ElectricityAccount.findByPk(id, {
            include: ['user', 'electricityService', 'billings']
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Electricity account not found or /ID does not exist'
            });
        }

        return res.status(200).json({
            success: true,
            data: account
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new electricity account
exports.addAccount = async (req, res) => {
    try {
        const { user_id, electricity_service_id, customer_number, customer_name, address } = req.body;
        const newAccount = await ElectricityAccount.create({
            user_id,
            electricity_service_id,
            customer_number,
            customer_name,
            address,
            status: 'ACTIVE'
        });

        return res.status(201).json({
            success: true,
            message: 'Account registered successfully',
            data: newAccount
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update electricity account
exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await ElectricityAccount.findByPk(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Electricity account not found or /id does not exist'
            });
        }

        await account.update(req.body);
        return res.status(200).json({
            success: true,
            message: 'Account updated successfully',
            data: account
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete electricity account
exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await ElectricityAccount.findByPk(id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        await account.destroy();
        return res.status(200).json({
            success: true,
            message: 'Account successfully deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};