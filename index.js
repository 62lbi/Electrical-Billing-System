const express = require('express')
const path = require('path')

// Create the main Express application.
const app = express();

// Allow the application to read JSON request bodies.
app.use(express.json());

// Route to access uploaded file
app.use(express.static(__dirname))

// Load the routes
const ServiceRoute = require(`./routes/electricityService.route`)
const AccountRoute = require(`./routes/electricityAccount.route`)
const BillingRoute = require(`./routes/billing.route`)
const AuthRoute = require(`./routes/auth.routes`)
const PaymentRoute = require(`./routes/payment.routes`)

// Make index.js be able to read the routes
app.use(`/service`, ServiceRoute)
app.use(`/account`, AccountRoute)
app.use(`/billing`, BillingRoute)
app.use(`/auth`, AuthRoute)
app.use(`/payment`, PaymentRoute)

// Adding in the custom port number for the server
const PORT = 2008

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
})