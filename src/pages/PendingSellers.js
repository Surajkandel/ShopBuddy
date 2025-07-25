import React, { useEffect, useState } from 'react'
import summaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { FaEye, FaTimes, FaEyeSlash } from "react-icons/fa"

const PendingSellers = () => {
  const [pendingSellers, setPendingSellers] = useState([])
  const [expandedRows, setExpandedRows] = useState({})
  const [modalContent, setModalContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(summaryApi.updateStatus.url, {
        method: summaryApi.updateStatus.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          status: newStatus
        })
      });

      const data = await response.json();

      console.log("data is ", data);

      if (data.success) {
        toast.success(`Seller ${newStatus.toLowerCase()} successfully`);
        
        setPendingSellers(prevSellers =>
          prevSellers.map(seller =>
            seller._id === userId ? { ...seller, status: newStatus } : seller
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(`Failed to ${newStatus.toLowerCase()} seller`);
      console.error(error);
    }
  };



  const fetchPendingSellers = async () => {
    try {
      const fetchData = await fetch(summaryApi.pendingSellers.url, {
        method: summaryApi.pendingSellers.method,
        credentials: 'include'
      })
      const dataResponse = await fetchData.json()

      if (dataResponse.success) {
        setPendingSellers(dataResponse.data)
      } else {
        toast.error(dataResponse.message)
      }
    } catch (error) {
      toast.error("Failed to fetch pending sellers")
    }
  }

  useEffect(() => {
    fetchPendingSellers()
  }, [])

  const toggleRow = (sellerId) => {
    setExpandedRows(prev => ({
      ...prev,
      [sellerId]: !prev[sellerId]
    }))
  }

  const openModal = (url) => {
    setModalContent(url)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  const handleAccept = (sellerId) => {
    handleStatusChange(sellerId, 'ACCEPTED');
  };

  const handleReject = (sellerId) => {
    handleStatusChange(sellerId, 'REJECTED');
  };

  return (
    <div className="p-4 relative">
      {/* Modal for document viewing */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-[50vw] h-[70vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b p-3">
              <h3 className="text-lg font-semibold">Document Viewer</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-grow overflow-auto p-3">
              <div className="w-full h-full flex justify-center items-center">
                {modalContent && (
                  <img
                    src={modalContent}
                    alt="Document"
                    className="object-contain max-h-full max-w-full rounded"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      <h2 className="text-xl font-bold mb-4 text-gray-800">Pending Sellers</h2>
      <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        {/* Table content remains the same as before */}
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="p-3 border">S.N</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Shop Name</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingSellers.map((seller, index) => (
            <React.Fragment key={seller._id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{seller?.email}</td>
                <td className="p-3 border">{seller?.shopName || 'Not provided'}</td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${seller?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                    }`}>
                    {seller?.status}
                  </span>
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => toggleRow(seller._id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                    title={expandedRows[seller._id] ? "Hide details" : "View details"}
                  >
                    {expandedRows[seller._id] ? (
                      <FaEyeSlash className="inline-block text-lg" />
                    ) : (
                      <FaEye className="inline-block text-lg" />
                    )}
                  </button>
                </td>
              </tr>

              {expandedRows[seller._id] && (
                <tr className="bg-gray-50">
                  <td colSpan="5" className="p-4 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Seller Information */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 border-b pb-1">Seller Information</h3>
                        <p><strong>Name:</strong> <span className="text-gray-600">{seller?.name || 'Not provided'}</span></p>
                        <p><strong>Phone:</strong> <span className="text-gray-600">{seller?.phone || 'Not provided'}</span></p>
                        <p><strong>Address:</strong> <span className="text-gray-600">{seller?.address || 'Not provided'}</span></p>
                      </div>

                      {/* Business Details */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 border-b pb-1">Business Details</h3>
                        <p><strong>Registered:</strong> <span className="text-gray-600">{moment(seller?.createdAt).format('lll')}</span></p>
                        <p><strong>Last Updated:</strong> <span className="text-gray-600">{moment(seller?.updatedAt).format('lll')}</span></p>
                        <p>
                          <strong>Business License:</strong>
                          {seller?.businessLicense ? (
                            <button
                              onClick={() => openModal(seller.businessLicense)}
                              className="text-blue-600 hover:underline ml-2"
                            >
                              View Document
                            </button>
                          ) : <span className="text-gray-600 ml-2">Not provided</span>}
                        </p>
                      </div>

                      {/* Verification */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 border-b pb-1">Verification</h3>
                        <p>
                          <strong>Identity Proof:</strong>
                          {seller?.identityProof ? (
                            <button
                              onClick={() => openModal(seller.identityProof)}
                              className="text-blue-600 hover:underline ml-2"
                            >
                              View Document
                            </button>
                          ) : <span className="text-gray-600 ml-2">Not provided</span>}
                        </p>
                        <p>
                          <strong>Shop Logo:</strong>
                          {seller?.shopLogo ? (
                            <button
                              onClick={() => openModal(seller.shopLogo)}
                              className="text-blue-600 hover:underline ml-2"
                            >
                              View Logo
                            </button>
                          ) : <span className="text-gray-600 ml-2">Not provided</span>}
                        </p>
                      </div>


                      <div>
                        <div>
                          <button
                            onClick={() => handleAccept(seller._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                            disabled={seller.status !== 'PENDING'}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(seller._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            disabled={seller.status !== 'PENDING'}
                          >
                            Reject
                          </button>
                        </div>

                      </div>



                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PendingSellers