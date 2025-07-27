const axios = require('axios');
const crypto = require('crypto');

const MERCHANT_CODE = 'YOUR_MERCHANT_CODE';
const SECRET_KEY = 'YOUR_SECRET_KEY';
const BASE_URL = 'https://epay.esewa.com.np/api';

function generateSignature(data) {
  const hash = crypto.createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(data))
    .digest('hex');
  return hash;
}

exports.getRedirectUrl = ({ amount, orderId }) => {
  return `${BASE_URL}/initiate?amt=${amount}&pdc=0&psc=0&txAmt=0&tAmt=${amount}&pid=${orderId}&scd=${MERCHANT_CODE}&su=http://localhost:5173/payment-success&fu=http://localhost:5173/payment-failed`;
};

exports.verifyTransaction = async ({ oid, amt, refId }) => {
  const payload = {
    amount: amt,
    refId: refId,
    productId: oid,
    merchantCode: MERCHANT_CODE
  };

  try {
    const signature = generateSignature(payload);

    const res = await axios.post(`${BASE_URL}/verify`, payload, {
      headers: {
        'Authorization': signature,
        'Content-Type': 'application/json'
      }
    });

    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};
