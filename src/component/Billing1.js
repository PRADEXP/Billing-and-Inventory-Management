import React, { useState } from 'react';
import axios from 'axios';
import './Billing1.css';

export default function Billing1() {
  const [ProductId, setProductId] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [User, setUser] = useState({
    name: "",
    address: "",
    list: [],
    totalAmount: 0
  });

  const [paymentMode, setPaymentMode] = useState("normal"); // "normal" or "userId"
  const [payerId, setPayerId] = useState("");

  const onchageUser = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

 const HandlesAdd = (id) => {
  if (!id) {
    alert("Please enter a valid Product ID");
    return;
  }

  if (productCount <= 0) {
    alert("Product count must be greater than zero");
    return;
  }

  if (editMode) {
    // EDIT existing product in list
    const updatedList = User.list.map(item => {
      console.log("Editing item productId:", item.productId);
      if (item.productId === editId) {
        if (!item.productId) {
          alert("Cannot edit item with missing productId");
          return item; // skip editing if productId missing
        }
        return { ...item, quantity: productCount };
      }
      return item;
    });

    // Recalculate totalAmount
    const updatedTotal = updatedList.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

    setUser(prev => ({
      ...prev,
      list: updatedList,
      totalAmount: updatedTotal
    }));

    setEditMode(false);
    setEditId(null);

  } else {
    // ADD new product
    axios.get(`http://localhost:5000/api/product/get/${id}`)
      .then(res => {
        const product = res.data;
        console.log("Fetched product:", product);

        if (!product || !product._id) {
          alert("Invalid product data received from server");
          return;
        }

        const productStock = parseInt(product.total);
        const productPrice = parseInt(product.price);

        if (productStock === 0) {
          alert("Out of stock!");
          return;
        }

        if (productCount > productStock) {
          alert(`Only ${productStock} in stock`);
          return;
        }

        const newItem = {
          productId: product._id,
          productName: product.name,
          quantity: productCount,
          totalPrice: productPrice
        };

        // Make sure productId is valid before adding
        if (!newItem.productId) {
          alert("Product ID missing! Cannot add product.");
          return;
        }

        // Check if product already exists in list — optionally update quantity instead of adding duplicate
        const existingIndex = User.list.findIndex(item => item.productId === newItem.productId);
        let updatedList = [];
        if (existingIndex !== -1) {
          // Update existing product quantity
          updatedList = [...User.list];
          updatedList[existingIndex].quantity += productCount;
        } else {
          // Add new product
          updatedList = [...User.list, newItem];
        }

        const updatedTotal = updatedList.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

        setUser(prev => ({
          ...prev,
          list: updatedList,
          totalAmount: updatedTotal
        }));

        // Reduce stock on server
        axios.put(`http://localhost:5000/api/product/put/${id}`, {
          ...product,
          total: (productStock - productCount).toString()
        }).catch(err => {
          console.error("Error updating product stock:", err);
        });

      }).catch(err => {
        alert("Error fetching product from server");
        console.error(err);
      });
  }
};


  const handleDelete = (id) => {
    const updatedList = User.list.filter(item => item.productId !== id);
    const updatedTotal = updatedList.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
    setUser(prev => ({ ...prev, list: updatedList, totalAmount: updatedTotal }));
  };

  const handleEdit = (item) => {
    setProductId(item.productId);
    setProductCount(item.quantity);
    setEditMode(true);
    setEditId(item.productId);
  };

  const handleSubmitBill = async () => {
    if (!User.name || !User.address || User.list.length === 0) {
      alert("Please complete the bill");
      return;
    }

    // If payment via user ID, validate payer and balance
    if (paymentMode === "userId") {
      if (!payerId) {
        alert("Please enter payer User ID");
        return;
      }

      try {
        const payerRes = await axios.get(`http://localhost:5000/api/user/get/${payerId}`);
        const payer = payerRes.data;

        if (!payer) {
          alert("Payer user not found");
          return;
        }

        if (payer.money < User.totalAmount) {
          alert("Payer has insufficient balance");
          return;
        }

        // Deduct money from payer and update on server
        await axios.put(`http://localhost:5000/api/user/put/${payerId}`, {
          ...payer,
          money: payer.money - User.totalAmount
        });

      } catch (error) {
        alert("Error processing payment");
        console.error(error);
        return;
      }
    }

    // Submit the bill as usual
    const billData = {
      name: User.name,
      address: User.address,
      products: User.list,
      totalAmount: User.totalAmount,
      date: new Date().toISOString(),
      paidBy: paymentMode === "userId" ? payerId : "Normal Payment"
    };
    console.log(billData)
    axios.post("http://localhost:5000/api/sales/post", billData)
      .then(() => {
        alert("Bill submitted successfully");
        setUser({
          name: "",
          address: "",
          list: [],
          totalAmount: 0
        });
        setProductId("");
        setProductCount(0);
        setPayerId("");
        setPaymentMode("normal");
      })
      .catch(err => {
        alert("Error submitting bill");
        console.error(err);
      });
  };

  return (
<div className="billing-container">
  <h1 className='billing-h2'>Billing</h1>
  <form className="billing-form" onSubmit={e => e.preventDefault()}>
    <label className="billing-label">Name</label>
    <input className="billing-input" value={User.name} name='name' onChange={onchageUser} /><br />

    <label className="billing-label">Address</label>
    <textarea className="billing-textarea" name='address' value={User.address} onChange={onchageUser}></textarea><br />

    <label className="billing-label">Product ID</label>
    <input className="billing-input" value={ProductId} type='text' onChange={e => setProductId(e.target.value)} /><br />

    <label className="billing-label">Product Count</label>
    <input className="billing-input" value={productCount} type='number' onChange={e => setProductCount(Number(e.target.value))} /><br />

    <button className="billing-button" type="button" onClick={() => HandlesAdd(ProductId)}>
      {editMode ? "Update" : "Add"}
    </button>
  </form>

  <hr className="billing-hr" />

  <div className="billing-radio-group">
    <label className="billing-radio-label">
      <input
        type="radio"
        value="normal"
        checked={paymentMode === "normal"}
        onChange={() => setPaymentMode("normal")}
      /> Pay Normally
    </label>

    <label className="billing-radio-label" style={{ marginLeft: '20px' }}>
      <input
        type="radio"
        value="userId"
        checked={paymentMode === "userId"}
        onChange={() => setPaymentMode("userId")}
      /> Pay Through User ID
    </label>
  </div>

  {paymentMode === "userId" && (
    <div className="billing-payer-id">
      <label className="billing-label">Payer User ID: </label>
      <input
        className="billing-input"
        type="text"
        value={payerId}
        onChange={e =>{
         setPayerId(e.target.value.trim())}
        }
          
      />
    </div>
  )}

  <h2 className="billing-h2">Customer: {User.name}</h2>
  <h3 className="billing-h3">Address: {User.address}</h3>

  <table className="billing-table">
    <thead>
      <tr>
        <th className="billing-th">Name</th>
        <th className="billing-th">Price</th>
        <th className="billing-th">Quantity</th>
        <th className="billing-th">Actions</th>
      </tr>
    </thead>
    <tbody>
      {User.list.map((item, i) => (
        <tr key={item.productId} className="billing-tr">
          <td className="billing-td">{item.productName}</td>
          <td className="billing-td">₹{item.totalPrice}</td>
          <td className="billing-td">{item.quantity}</td>
          <td className="billing-td">
            <button className="billing-action-button" onClick={() => handleEdit(item)}>Edit</button>
            <button className="billing-action-button" onClick={() => handleDelete(item.productId)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <h2 className="billing-h2">Total: ₹{User.totalAmount}</h2>
  <button className="billing-submit-button" type="button" onClick={handleSubmitBill}>Submit Bill</button>
</div>

  );
}
