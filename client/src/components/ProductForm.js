import React, { useState } from 'react'
import productService from '../services/products'

const ProductForm = () => {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName, description }
    productService.create(product)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Tuotteen nimi
          <input
            type='text'
            value={productName}
            onChange={({ target }) => setProductName(target.value)}
          />
        </label>
        <br />
        <label>
          Tuotteen selitys
          <input
            type='text'
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </label>
        <br />
        <button type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
