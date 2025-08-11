import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './SalesComponent.css' // optional, for styling

export default function SalesComponent() {
  const [sales, setSales] = useState([])
  const [refresh,setrefresh]=useState(false)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:5000/api/sales/get')
      .then(res => {
        const data = res.data
        setSales(data)

        const total = data.reduce((sum, sale) => sum + sale.totalAmount, 0)
        setTotalRevenue(total)

      })
      .catch(err => console.error("Failed to fetch sales:", err))
  }, [refresh])
  const handleDelete=()=>{
      axios.delete(`http://localhost:5000/api/sales/del`)
    setrefresh(prev=>!prev)
  }

  return (
    <div className="analytics-container">
      <h1 className="analytics-h1">Sales Analytics</h1>
      <button className='analytics-button' onClick={handleDelete}>Reset</button>
      <p><strong>Total Revenue:</strong> ₹{totalRevenue}</p>
      <p><strong>Total Bills:</strong> {sales.length}</p>
      <h2 className="analytics-h1">Sales History</h2>
      <table className='analytics-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>ProductsName</th>
            <th>Total</th>
            <th>paymentMode</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{new Date(sale.date).toLocaleString()}</td>
              <td>{sale.name}</td>
              <td>
                {sale.products.map(p => (
                  <div key={p.productId}>{p.productName}x{p.quantity}</div>
                ))}
              </td>
              <td>₹{sale.totalAmount}</td>
              <td>{sale.paidBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
