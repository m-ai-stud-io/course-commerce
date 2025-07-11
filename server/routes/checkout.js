const express = require('express');
const router = express.Router();
console.log('STRIPE_SECRET_KEY in checkout.js:', process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Course = require('../models/Course');

// @route   POST /api/checkout
// @desc    Process payment and create order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { courseIds, totalAmount, paymentMethodId } = req.body;

  try {
    // Verify courses and total amount on the backend to prevent tampering
    const courses = await Course.find({ _id: { $in: courseIds } });
    const calculatedTotal = courses.reduce((acc, course) => acc + course.price, 0);

    if (calculatedTotal.toFixed(2) !== totalAmount.toFixed(2)) {
      return res.status(400).json({ msg: 'Total amount mismatch' });
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true, // Confirm the payment immediately
      return_url: 'http://localhost:3000/checkout-success', // Not strictly needed for API, but good practice
    });

    if (paymentIntent.status === 'succeeded') {
      const order = new Order({
        user: req.user.id,
        courses: courses.map(course => ({ course: course._id, title: course.title, price: course.price })),
        totalAmount,
        paymentStatus: 'completed',
        paymentIntentId: paymentIntent.id,
      });

      await order.save();
      res.json({ success: true, orderId: order._id, paymentIntentId: paymentIntent.id });
    } else {
      res.status(400).json({ msg: 'Payment failed', paymentIntentStatus: paymentIntent.status });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;