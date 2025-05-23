import React, { useEffect, useState } from 'react'
import summaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'

const AllUsers = () => {

  const [allUsers, setAllUsers] = useState([])

  const fetchAllUsers = async () => {
    const fetchData = await fetch(summaryApi.allUsers.url, {
      method: summaryApi.allUsers.method,
      credentials: 'include'
    })
    const dataResponse = await fetchData.json()

    if (dataResponse.success) {
      setAllUsers(dataResponse.data)

    }
    if (dataResponse.error) {
      toast.error(dataResponse.message)
    }

    // console.log("data response",dataResponse)
  }


  useEffect(() => {
    fetchAllUsers()


  })

  return (
    <div>
      <table className='border '>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
            {/* <th>Create date</th> */}
            <th>view</th>
          </tr>
        </thead>
        <tbody>
          {
            allUsers.map((el, index) => {
              return (
                <tr>
                  <td>{index+=1}</td>
                  <td>{el?.name}</td>
                  <td>{el?.email}</td>
                  {/* <td>{moment(el?.createdAt).format('ll')}</td> */}
                  <td>View</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default AllUsers
