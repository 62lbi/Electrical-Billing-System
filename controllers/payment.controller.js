const { Payment, Billing } = require('../models');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: ['billing', 'verifier']
        });
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Upload payment proof for a billing
exports.createPayment = async (req, res) => {
    try {
        const { billing_id } = req.body;
        const payment_proof = req.file ? req.file.path : null;

        if (!payment_proof) {
            return res.status(400).json({ success: false, message: 'Payment proof file is required.' });
        }

        // Check if payment record already exists for this billing (to handle re-uploads if rejected)
        let payment = await Payment.findOne({ where: { billing_id } });

        if (payment) {
            // Update existing record for re-submission
            await payment.update({
                payment_proof,
                status: 'PENDING',
                verified_by: null,
                verified_at: null
            });
        } else {
            // Create new payment record
            payment = await Payment.create({
                billing_id,
                payment_proof,
                status: 'PENDING'
            });
        }

        // Update corresponding billing status to WAITING_VERIFICATION
        await Billing.update({ status: 'WAITING_VERIFICATION' }, { where: { id: billing_id } });

        return res.status(201).json({
            success: true,
            message: 'Payment proof uploaded successfully and pending verification',
            data: payment
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Admin verification action (Approve or Reject)
exports.verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, verified_by } = req.body; // status can be APPROVED or REJECTED

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }

        const billingStatus = status === 'APPROVED' ? 'PAID' : 'UNPAID';

        await payment.update({
            status,
            verified_by,
            verified_at: new Date()
        });

        await Billing.update({ status: billingStatus }, { where: { id: payment.billing_id } });

        return res.status(200).json({
            success: true,
            message: `Payment successfully ${status.toLowerCase()}`,
            data: payment
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};