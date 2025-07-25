import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const pid = localStorage.getItem("cartOrderId");
      const amt = params.get("amt");
      const rid = params.get("refId");

      try {
        const res = await fetch("http://localhost:8080/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amt, pid, rid })
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Payment verified and order placed.");
          localStorage.removeItem("cartOrderId");
          navigate("/my-orders");
        } else {
          toast.error("Payment verification failed.");
          navigate("/cart");
        }
      } catch (err) {
        toast.error("Error verifying payment.");
      }
    };

    verifyPayment();
  }, []);

  return <div className="p-8">Verifying Payment...</div>;
};

export default PaymentSuccess;
