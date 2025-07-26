import axios from "axios";

const backendDomain = "http://localhost:8080"; // adjust for production

// Create order before payment
export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(`${backendDomain}/api/order/create`, orderData, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Order creation error:", error);
    throw error;
  }
};

// Initiate eSewa payment
export const initiateEsewaPayment = async ({ orderId, totalAmount }) => {
  try {
    const res = await axios.post(`${backendDomain}/api/payment/esewa/initiate`, {
      orderId,
      totalAmount,
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Esewa initiation error:", error);
    throw error;
  }
};

// Verify eSewa payment
export const verifyEsewaPayment = async (oid) => {
  try {
    const res = await axios.get(`${backendDomain}/api/payment/esewa/verify?oid=${oid}`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Esewa verification failed:", error);
    throw error;
  }
};

// Clear cart after successful payment
export const clearCart = async () => {
  try {
    const res = await axios.delete(`${backendDomain}/api/cart/clear`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async () => {
  try {
    const res = await axios.get(`${backendDomain}/api/order/user-orders`, {
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Get orders error:", error);
    throw error;
  }
};