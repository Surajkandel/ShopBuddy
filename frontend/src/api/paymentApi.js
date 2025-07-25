// src/api/paymentApi.js

import axios from "axios";

const backendDomain = "http://localhost:8080"; // adjust for production

export const initiateEsewaPayment = async ({ amount, productId }) => {
  try {
    const res = await axios.post(`${backendDomain}/api/payment/esewa/initiate`, {
      amount,
      productId,
    });
    return res;
  } catch (error) {
    console.error("Esewa initiation error:", error);
    throw error;
  }
};

export const verifyEsewaPayment = async ({ amt, oid, refId }) => {
  try {
    const res = await axios.post(`${backendDomain}/api/payment/esewa/verify`, {
      amt,
      oid,
      refId,
    });
    return res.data;
  } catch (error) {
    console.error("Esewa verification failed:", error);
    throw error;
  }
};
