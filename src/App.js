import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Homepage from './component/Homepage'
import SignUppage from './component/SignUppage'
import EmployeePage from './component/EmployeePage'
import ManagerPage from './component/ManagerPage'
import Authentication from './component/Authentication'
import AuthRequest from './component/AuthRequest'
import PageNotfound from './component/PageNotfound'
import Profile from './component/Profile'
import UserPage from './component/UserPage'
export const Authcontext=React.createContext()

export default function App() {
  return (
    <div className="app-container">
      <Authentication>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/employee" element={<AuthRequest><EmployeePage /></AuthRequest>} />
        <Route path="/manager" element={<AuthRequest><ManagerPage /></AuthRequest>} />
        <Route path="/SignUp" element={<SignUppage />} />
        <Route path="*" element={<PageNotfound/>}/>
        <Route path='/profile' element={<AuthRequest><Profile/></AuthRequest>}/>
        <Route path='/users' element={<AuthRequest><UserPage/></AuthRequest>}/>
      </Routes>
    </Authentication>
    </div>
  )
}
