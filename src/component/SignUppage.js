import axios from 'axios'
import React, { useState } from 'react'
import {useNavigate, useSearchParams } from 'react-router-dom'
import './SignUpPage.css'

export default function SignUppage(props) {
    const [searchParams] = useSearchParams();
    const nav=useNavigate()
    const sign=searchParams.get('type');
    const [employee, setEmployee] = useState({
        name: "",
        password: ""
    })
    const [manager, setmanager] = useState({
        name: "",
        password: ""
    })

    const onChangeEmployee = (event) => {
        const { name, value } = event.target
        setEmployee(prev => ({ ...prev, [name]: value }))
    }
    const onChangeManager = (event) => {
        const { name, value } = event.target
        setmanager(prev => ({ ...prev, [name]: value }))
    }

    const registerEmployee = (event) => {
        event.preventDefault()
        axios.post("http://localhost:5000/api/signup/employee", employee)
            .then(res => {
                console.log(res)
                alert("Register successful")
                nav('/')
                setEmployee({ name: "", password: "" }) 
            })
            .catch(err => {
                console.error(err)
                alert("Registration failed")
            })
    }
    const registerManager = (event) => {
        event.preventDefault()
        axios.post("http://localhost:5000/api/signup/manager", manager)
            .then(res => {
                console.log(res)
                alert("Register successful")
                nav('/')
                setmanager({ name: "", password: "" })
            })
            .catch(err => {
                console.error(err)
                alert("Registration failed")
            })
    }

    return (
        <div className="signuppage-container">
  <h1 className="signuppage-h1">
    {sign === 'true' ? 'Employee' : 'Manager'} Registration
  </h1>
  <form
    className="signuppage-form"
    onSubmit={sign === 'true' ? registerEmployee : registerManager}
  >
    <label className="signuppage-label">Name</label>
    <input
      className="signuppage-input"
      value={sign === 'true' ? employee.name : manager.name}
      name="name"
      onChange={sign === 'true' ? onChangeEmployee : onChangeManager}
      required
    />

    <label className="signuppage-label">Password</label>
    <input
      className="signuppage-input"
      type="password"
      value={sign === 'true' ? employee.password : manager.password}
      name="password"
      onChange={sign === 'true' ? onChangeEmployee : onChangeManager}
      required
    />

    <button className="signuppage-button" type="submit">
      Register
    </button>
  </form>
</div>

    )
}
