import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Context from '../context';

const CheckStatus = () => {
  const { user } = useContext(Context);
  const { status } = useParams();

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Seller Status</h2>

      {status === 'PENDING' && (
        <p className="text-yellow-600 text-lg font-medium">
          🕒 Your document is under evaluation. Please wait for admin approval.
        </p>
      )}

      {(status === 'ACCEPTED' || status === 'ACTIVE') && (
        <div>
          <p className="text-green-600 text-lg font-medium mb-4">
            ✅ Your seller account is active!
          </p>
          <Link to="/seller-pannel/all-products">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
              Go to Seller Panel
            </button>
          </Link>
        </div>
      )}

      {!['PENDING', 'ACCEPTED', 'ACTIVE'].includes(status) && (
        <p className="text-red-600 font-medium">
          ❌ Invalid status or something went wrong.
        </p>
      )}
    </div>
  );
};

export default CheckStatus;
