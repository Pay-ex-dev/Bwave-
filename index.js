const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    try {
        const customer = await stripe.customers.create({ email });
        const setupIntent = await stripe.setupIntents.create({ customer: customer.id });

        res.json({ clientSecret: setupIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

module.exports = mongoose.model('User', userSchema);
