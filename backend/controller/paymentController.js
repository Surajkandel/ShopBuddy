const axios = require("axios");
const Order = require("../models/Order");
const Cart = require("../models/Cart"); // assume you have a cart model
const User = require("../models/User");

exports.initiatePayment = async (req, res) => {
  const { amount, productId } = req.body;
  const params = new URLSearchParams({
    amt: amount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: amount,
    pid: productId,
    scd: process.env.ESEWA_MERCHANT_CODE,
    su: process.env.ESEWA_SUCCESS_URL,
    fu: process.env.ESEWA_FAILURE_URL
  });
  const paymentURL = `${process.env.ESEWA_PAYMENT_URL}?${params.toString()}`;
  res.json({ paymentURL });
};

exports.verifyPayment = async (req, res) => {
  const { amt, pid, rid } = req.body;
  const xmlData = `
    <paymentVerificationRequest>
      <amt>${amt}</amt>
      <scd>${process.env.ESEWA_MERCHANT_CODE}</scd>
      <pid>${pid}</pid>
      <rid>${rid}</rid>
    </paymentVerificationRequest>
  `;

  try {
    const result = await axios.post(process.env.ESEWA_VERIFY_URL, xmlData, {
      headers: { "Content-Type": "text/xml" },
    });

    if (result.data.includes("<response_code>Success</response_code>")) {
      const userId = req.userId; // from auth middleware if exists
      const cartItems = await Cart.find({ userId }).populate("productId");

      const order = new Order({
        userId,
        products: cartItems,
        amount: amt,
        pid,
        rid
      });

      await order.save();
      await Cart.deleteMany({ userId });

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid transaction" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed", error });
  }
};
