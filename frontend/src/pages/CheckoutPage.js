import React from "react";
import EsewaButton from "../components/EsewaButton";

const CheckoutPage = () => {
  const orderAmount = 1000; // test amount in paisa (e.g., 1000 = Rs 10)
  const productId = "PID12345"; // any unique ID

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
        <p className="text-lg mb-6 text-center">Amount: NPR {orderAmount}</p>
        <EsewaButton amount={orderAmount} productId={productId} />
      </div>
    </div>
  );
};

export default CheckoutPage;
