import React, {useState } from 'react'
export const Authcontext=React.createContext();
export default function Authentication({children}) {
    const [userlogin,setuserlogin]=useState({
        id:"",
        name:"",
        status:false
    })
  return (
    <Authcontext.Provider value={{userlogin,setuserlogin}}>
        {children}
    </Authcontext.Provider>
  )
}
