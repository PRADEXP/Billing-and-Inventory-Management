import React, { useContext } from 'react'
import { Authcontext } from './Authentication'
import { Navigate } from 'react-router-dom'
export default function AuthRequest({children}) {
    const {userlogin}=useContext(Authcontext)
    if(!userlogin.status){
        return <Navigate to="/"/>
    }
    else{
        return children;
    }
}
