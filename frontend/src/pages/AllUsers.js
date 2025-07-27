import React, { useEffect, useState } from 'react'
import summaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { FaEye, FaEyeSlash } from "react-icons/fa"

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([])
  const [expandedRows, setExpandedRows] = useState({})

  const fetchAllUsers = async () => {
    try {
      const fetchData = await fetch(summaryApi.allUsers.url, {
        method: summaryApi.allUsers.method,
        credentials: 'include'
      })
      const dataResponse = await fetchData.json()

      if (dataResponse.success) {
        setAllUsers(dataResponse.data)
      } else {
        toast.error(dataResponse.message)
      }
    } catch (error) {
      toast.error("Failed to fetch users")
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800" >All Users</h2>
      <table className="min-w-full border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">S.N</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((el, index) => (
            <React.Fragment key={el._id}>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{el?.email}</td>
                <td className="p-2 border">{el?.role}</td>
                <td
                  className="p-2 border text-blue-600 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  {expandedRows[index] ? <FaEyeSlash /> : <FaEye />}
                </td>
              </tr>

              {expandedRows[index] && (
                <tr className="bg-gray-50">
                  <td colSpan="4" className="p-4 border">
                    <div className="space-y-2 text-sm leading-relaxed">
                      <div><strong>User ID:</strong> {el?._id}</div>
                      <div><strong>Name:</strong> {el?.name}</div>
                      <div><strong>Email:</strong> {el?.email}</div>
                      <div><strong>Role:</strong> {el?.role}</div>
                      <div><strong>Status:</strong> {el?.status}</div>
                      <div><strong>Phone:</strong> {el?.phone || "N/A"}</div>
                      <div><strong>Shop Name:</strong> {el?.shopName || "N/A"}</div>
                      <div><strong>Address:</strong> {el?.address || "N/A"}</div>
                      <div><strong>Created At:</strong> {moment(el?.createdAt).format('llll')}</div>
                      <div><strong>Updated At:</strong> {moment(el?.updatedAt).format('llll')}</div>

                      {el?.shopLogo && (
                        <div>
                          <strong>Shop Logo:</strong>{' '}
                          <a
                            href={el.shopLogo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Logo
                          </a>
                        </div>
                      )}

                      {el?.businessLicense && (
                        <div>
                          <strong>Business License:</strong>{' '}
                          <a
                            href={el.businessLicense}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View License
                          </a>
                        </div>
                      )}

                      {el?.identityProof && (
                        <div>
                          <strong>Identity Proof:</strong>{' '}
                          <a
                            href={el.identityProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View ID
                          </a>
                        </div>
                      )}
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

export default AllUsers