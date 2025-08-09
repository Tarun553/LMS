"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useUser} from '@clerk/nextjs'
import {userDetailContext} from '@/context/userDetailContext'

const Provider = ({children}) => {
  const [userDetail, setUserDetail] = useState();
  const{user} = useUser();
  const CreateNewUser = async()=>{

    const result = await axios.post('/api/user',{
      name:user?.fullName,
      email:user?.primaryEmailAddress?.emailAddress
    })
    setUserDetail(result.data)
    
  }
  useEffect(()=>{
   user && CreateNewUser()
  },[user])
  return (
    <div>
      <userDetailContext.Provider value={{userDetail,setUserDetail}}>
      {children}
      </userDetailContext.Provider>
      </div>
  )
}

export default Provider