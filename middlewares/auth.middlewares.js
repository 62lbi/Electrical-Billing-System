const jwt = require('jsonwebtoken');

// Use an environment variable for security, with a fallback for local testing
const JWT_SECRET = process.env.JWT_SECRET || 'moklet';

/**
 * Middleware to verify the JWT token sent in the Authorization header.
 * Expected header format: "Authorization: Bearer <token>"
 */
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token.' 
            });
        }

        // Attach the decoded token payload (e.g., id, email, role) to req.user
        req.user = decodedUser;
        next(); // Proceed to the controller or next middleware
    });
};

/**
 * Middleware to restrict access strictly to users with the 'ADMIN' role.
 * Note: verifyToken must always run *before* this middleware so req.user exists.
 */
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next(); // User is an admin, proceed
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Admin only required' 
        });
    }
};

exports.isCustomer = (req, res, next) => {
    if (req.user && req.user.role === 'CUSTOMER') {
        next(); //User is an customer, proceed
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Customer only required'
        })
    }
}