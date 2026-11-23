const { Billing, ElectricityAccount, ElectricityService } = require('../models');

// Get all billings
exports.getAllBillings = async (req, res) => {
    try {
        const billings = await Billing.findAll({
            include: [{
                model: ElectricityAccount,
                as: 'electricityAccount',
                include: ['electricityService']
            }]
        });

        return res.status(200).json({
            success: true,
            data: billings,
            message: "Billings successfully loaded."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single billing by ID
exports.getBillingById = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await Billing.findByPk(id, {
            include: ['electricityAccount', 'payment']
        });

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found or /id does not exist'
            });
        }

        return res.status(200).json({
            success: true,
            data: billing
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new billing and record meter readings
exports.addBilling = async (req, res) => {
    try {
        const { electricity_account_id, period_month, period_year, previous_meter, current_meter, due_date } = req.body;

        // Validation: current_meter must be >= previous_meter
        if (current_meter < previous_meter) {
            return res.status(400).json({
                success: false,
                message: 'Current meter reading must be greater than or equal to previous meter reading.'
            });
        }

        // Fetch the electricity account to get its service and tariff price snapshot
        const account = await ElectricityAccount.findByPk(electricity_account_id, {
            include: ['electricityService']
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found or /id does not exist'
            });
        }

        const tariff_per_kwh = account.electricityService.price_per_kwh;
        const consumption = current_meter - previous_meter;
        const amount = consumption * tariff_per_kwh;

        const newBilling = await Billing.create({
            electricity_account_id,
            period_month,
            period_year,
            previous_meter,
            current_meter,
            consumption,
            tariff_per_kwh,
            amount,
            due_date,
            status: 'UNPAID' // Default status when created
        });

        return res.status(201).json({
            success: true,
            message: 'Billing and meter record created successfully',
            data: newBilling
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update billing
exports.updateBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await Billing.findByPk(id);

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found or /id does not exist'
            });
        }

        // If meter readings are updated, recalculate consumption and amount
        const previous_meter = req.body.previous_meter !== undefined ? req.body.previous_meter : billing.previous_meter;
        const current_meter = req.body.current_meter !== undefined ? req.body.current_meter : billing.current_meter;

        if (current_meter < previous_meter) {
            return res.status(400).json({
                success: false,
                message: 'Current meter reading must be greater than or equal to previous meter reading.'
            });
        }

        const consumption = current_meter - previous_meter;
        const amount = consumption * billing.tariff_per_kwh;

        await billing.update({
            ...req.body,
            consumption,
            amount
        });

        return res.status(200).json({
            success: true,
            message: 'Billing updated successfully',
            data: billing
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete billing
exports.deleteBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await Billing.findByPk(id);

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing not found or /id does not exist'
            });
        }

        await billing.destroy();
        return res.status(200).json({
            success: true,
            message: 'Billing successfully deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};