import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Product.css'

export default function Product1() {
  const [productList, setProductList] = useState([])
  const [form, setForm] = useState({ name: '', total: 0, price: 0 })
  const [editId, setEditId] = useState(null)

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/product/get')
      .then(res => setProductList(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const endpoint = editId
      ? `http://localhost:5000/api/product/put/${editId}`
      : 'http://localhost:5000/api/product/post'

    const method = editId ? axios.put : axios.post

    method(endpoint, form)
      .then(() => {
        setForm({ name: '', total: 0, price: 0 })
        setEditId(null)
        fetchProducts()
      })
      .catch(err => console.log(err))
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, total: product.total, price: product.price })
    setEditId(product._id)
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/product/del/${id}`)
      .then(fetchProducts)
      .catch(err => console.log(err))
  }

  return (
     <div className="product-container">
    <h2 className="product-title">INVENTORY</h2>

    <form className="product-form" onSubmit={handleSubmit}>
      <label>Product Name</label>
      <input
        className="product-input"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
      />
      <label>Stock</label>
      <input
        className="product-input"
        name="total"
        type="number"
        value={form.total}
        onChange={handleChange}
        placeholder="Total Quantity"
      />
      <label>Price</label>
      <input
        className="product-input"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <button className="product-button" type="submit">
        {editId ? "Update" : "Add"}
      </button>
    </form>

    <table className="product-table">
      <thead>
        <tr>
          <th className="product-th">ID</th>
          <th className="product-th">Name</th>
          <th className="product-th">Stock</th>
          <th className="product-th">Price</th>
          <th className="product-th">Actions</th>
        </tr>
      </thead>
      <tbody>
        {productList.map(product => (
          <tr key={product._id}>
            <td className="product-td">{product._id}</td>
            <td className="product-td">{product.name}</td>
            <td className="product-td">{product.total}</td>
            <td className="product-td">{product.price}</td>
            <td className="product-td">
              <button
                className="product-button"
                type="button"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="product-button"
                type="button"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}
