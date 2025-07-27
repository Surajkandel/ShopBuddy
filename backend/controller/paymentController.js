const EsewaV2 = require('../utils/esewaUtils');
const Order = require('../models/orderModel');

exports.initiatePayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { totalAmount, items } = req.body;

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      status: 'pending',
    });

    const esewaURL = EsewaV2.getRedirectUrl({
      amount: totalAmount,
      orderId: order._id,
    });

    res.json({ success: true, url: esewaURL });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { oid, amt, refId } = req.query;

    const result = await EsewaV2.verifyTransaction({ oid, amt, refId });

    if (result.success) {
      const order = await Order.findByIdAndUpdate(oid, {
        status: 'paid',
        payment: {
          transactionUuid: refId,
          totalAmount: amt,
          status: 'completed'
        }
      }, { new: true });

      res.json({ success: true, order, payment: order.payment });
    } else {
      res.json({ success: false, message: 'Verification failed at eSewa' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification error' });
  }
};
