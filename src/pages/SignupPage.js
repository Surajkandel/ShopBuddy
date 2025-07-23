import React, { useState } from 'react';
import Signup from './Signup'; 
import SellerSignup from './Signup'; 
import { motion, AnimatePresence } from 'framer-motion';

const SignupPage = () => {
  const [activeForm, setActiveForm] = useState('user'); 

  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveForm('user')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${activeForm === 'user'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`}
        >
          User Signup
        </button>
        <button
          onClick={() => setActiveForm('seller')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${activeForm === 'seller'
              ? 'bg-green-600 text-white shadow-md scale-105'
              : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
        >
          Seller Signup
        </button>
      </div>

      {/* Sliding Animation between components */}
      <div className="w-full max-w-xl relative overflow-hidden bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <AnimatePresence mode="wait">
          {activeForm === 'user' ? (
            <motion.div
              key="user"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Signup />
            </motion.div>
          ) : (
            <motion.div
              key="seller"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <SellerSignup />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupPage;
