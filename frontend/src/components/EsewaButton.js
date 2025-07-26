import React from "react";

const EsewaButton = ({ amount, productId }) => {
  const handleEsewaPayment = () => {
    const path = "https://rc-epay.esewa.com.np/api/epay/main";
    const tAmt = amount;
    const amt = amount;
    const txAmt = 0;
    const psc = 0;
    const pdc = 0;
    const scd = "EPAYTEST"; // test merchant code
    const su = "http://localhost:3000/esewa-payment-success"; // success redirect
    const fu = "http://localhost:3000/esewa-payment-failure"; // failure redirect

    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    const formData = {
      amt,
      psc,
      pdc,
      txAmt,
      tAmt,
      pid: productId,
      scd,
      su,
      fu,
    };

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  return (
    <button
      onClick={handleEsewaPayment}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition"
    >
      Pay with eSewa
    </button>
  );
};

export default EsewaButton;
