import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import './Homepage.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { Authcontext } from './Authentication';


export default function Homepage() {
    const [login, setLogin] = useState(true)
    const [employeeLogin, setEmployeeLogin] = useState([])
    const [managerLogin, setManagerLogin] = useState([])
    const nav=useNavigate()
    const {setuserlogin}=useContext(Authcontext)

    const [employee, setEmployee] = useState({ name: "", password: "" })
    const [manager, setManager] = useState({ name: "", password: "" })

    const onChangeEmployee = (event) => {
        const { name, value } = event.target
        setEmployee(prev => ({ ...prev, [name]: value }))
    }

    const onChangeManager = (event) => {
        const { name, value } = event.target
        setManager(prev => ({ ...prev, [name]: value }))
    }
    const employeeGet = () => {
        axios.get('http://localhost:5000/api/homepage/employeelogin')
            .then(res =>{ 
                setEmployeeLogin(res.data)
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    const managerGet = () => {
        axios.get("http://localhost:5000/api/homepage/managerlogin")
            .then(res => {
                setManagerLogin(res.data)
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        employeeGet()
        managerGet()
    }, [login])

    const handleEmployeeLogin = (event) => {
        event.preventDefault()
        const found = employeeLogin.find(x =>
            x.name === employee.name && x.password === employee.password
        )
        if (found) {
                setuserlogin({name:found.name,id:found._id,status:true})
                nav('/employee')
        } else {
            console.log("Invalid credentials")
            alert("Invalid password or Id")

        }
    }
    const handleManagerLogin = (event) => {
        event.preventDefault()
        const found = managerLogin.find(x =>
            x.name === manager.name && x.password === manager.password
        )
        if (found) {
            setuserlogin({name:found.name,id:found._id,status:true})
            console.log("Login successful")
            nav('/manager')
        } else {
            console.log("Invalid credentials")
            alert("Invalid password or Id")
        }
    }
    const handelSignup=(signUp)=>{
        nav(`/SignUp?type=${signUp}`)
    }
    return (
<div className='homepage-body'>
<div className="homepage-homecontainer">
  <h1 className="homepage-h1">Home</h1>

  <div className="homepage-button-group">
    <button className="homepage-button" onClick={() => setLogin(true)}>Employee</button>
    <button className="homepage-button" onClick={() => setLogin(false)}>Manager</button>
  </div>

  <div className="homepage-formtable">
    {login ? (
      <div>
        <form className="homepage-form" onSubmit={handleEmployeeLogin}>
          <h1 className="homepage-h1">Employee Login</h1>

          <label className="homepage-label">Employee Name</label>
          <input
            className="homepage-input"
            value={employee.name}
            name="name"
            onChange={onChangeEmployee}
          />

          <label className="homepage-label">Password</label>
          <input
            className="homepage-input"
            type="password"
            value={employee.password}
            name="password"
            onChange={onChangeEmployee}
          />

          <button className="homepage-button" type="submit">Login</button>
        </form>
        <button className="homepage-button" onClick={() => handelSignup(true)}>Sign Up</button>
      </div>
    ) : (
      <div>
        <form className="homepage-form" onSubmit={handleManagerLogin}>
          <h1 className="homepage-h1">Manager Login</h1>

          <label className="homepage-label">Manager Name</label>
          <input
            className="homepage-input"
            value={manager.name}
            name="name"
            onChange={onChangeManager}
          />

          <label className="homepage-label">Password</label>
          <input
            className="homepage-input"
            type="password"
            value={manager.password}
            name="password"
            onChange={onChangeManager}
          />

          <button className="homepage-button" type="submit">Login</button>
        </form>
        <button className="homepage-button" onClick={() => handelSignup(false)}>Sign Up</button>
      </div>
    )}
  </div>
</div>
</div>
    )
}
