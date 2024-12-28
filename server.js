require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe for payments
const { ethers } = require('ethers'); // Blockchain integration

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle payments securely
app.post('/api/payment', async (req, res) => {
    try {
        const { name, email, cardNumber, expiryDate, cvv } = req.body;

        // Simulate Stripe payment processing
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000, // Example amount in cents (50 USD)
            currency: 'usd',
            payment_method_data: {
                type: 'card',
                card: {
                    number: cardNumber,
                    exp_month: parseInt(expiryDate.split('/')[0], 10),
                    exp_year: parseInt('20' + expiryDate.split('/')[1], 10),
                    cvc: cvv,
                },
            },
            confirm: true,
        });

        // Blockchain transaction for record-keeping
        const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

        const tx = await wallet.sendTransaction({
            to: process.env.RECEIVER_WALLET_ADDRESS,
            value: ethers.utils.parseEther('0.05'), // Example: 0.05 ETH
        });

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            blockchainTx: tx.hash,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Payment failed' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
