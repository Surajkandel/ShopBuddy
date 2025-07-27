const Payment = require('../models/Payment');
const Order = require('../models/Order');
const axios = require('axios');

// eSewa Configuration
const ESEWA_CONFIG = {
  merchantId: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
  verifyUrl: process.env.ESEWA_VERIFY_URL || 'https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code='
};


async function verifyEsewaPayment(req, res) {
  try {
    const { oid } = req.query;
    const userId = req.userId;
    console.log("oid and userid is ", oid, userId)
    

    if (!oid) {
      return res.status(400).json({
        success: false,
        message: 'Transaction UUID is required'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({ 
      transactionUuid: oid,
      userId 
    }).populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    console.log("payment is ", payment)

    try {
      // Verify payment with eSewa
      const verifyUrl = `${ESEWA_CONFIG.verifyUrl}${ESEWA_CONFIG.merchantId}&transaction_uuid=${oid}`;

      console.log("verifyUrl",verifyUrl)
      const verificationResponse = await axios.get(verifyUrl);

      console.log("verificationResponse",verificationResponse)

      if (verificationResponse.data.status === 'COMPLETE') {
        // Update payment status
        payment.status = 'completed';
        payment.esewaResponse = verificationResponse.data;
        payment.updatedAt = new Date();
        await payment.save();
        

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
          payment.orderId._id, 
          { 
            status: 'paid',
            paymentStatus: 'completed'
          },
          { new: true }
        );

        res.json({
          success: true,
          message: 'Payment verified successfully',
          payment,
          order: updatedOrder
        });
      } else {
        payment.status = 'failed';
        payment.esewaResponse = verificationResponse.data;
        await payment.save();

        res.status(400).json({
          success: false,
          message: 'Payment verification failed',
          payment
        });
      }

    } catch (verifyError) {
      console.error('eSewa verification error:', verifyError);
      
      payment.status = 'failed';
      payment.esewaResponse = { error: verifyError.message };
      await payment.save();

      res.status(500).json({
        data:payment,
        success: false,
        message: 'Payment verification failed due to network error'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
}

module.exports = verifyEsewaPayment;