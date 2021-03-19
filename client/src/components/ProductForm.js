import React, { useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'

const ProductForm = () => {
  const { products, setProducts } = useStore()
  const [productName, setProductName] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName }
    productService.create(product).then(returnedProduct => {
      setProducts(products.concat(returnedProduct))
    })
    setProductName('')
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Tuotteen nimi
          <input id="nameInput"
            type='text'
            value={productName}
            onChange={({ target }) => setProductName(target.value)}
          />
        </label>
        <br />
        <button id="addproductBtn" type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
