const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT (use process.env.JWT_SECRET in production)
const JWT_SECRET = process.env.JWT_SECRET || 'moklet';

// Register a new customer
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password securely using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Public registration can ONLY create CUSTOMER accounts
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'CUSTOMER'
        });

        return res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login user and generate JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current profile (temporary pure endpoint version)
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id; // Securely from token
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// get all existing accounts/registered account in the database
// Get all registered user accounts (Admin only)
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Security: hide passwords
        });
        return res.status(200).json({
            success: true,
            message: 'Successfully shown all existing profile/datas',
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a user account by ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or ID does not exist'
            });
        }

        // Prevent admin from deleting themselves accidentally
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own admin account while logged in.'
            });
        }

        await user.destroy();
        return res.status(200).json({
            success: true,
            message: 'User account successfully deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};