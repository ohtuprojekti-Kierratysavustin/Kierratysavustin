import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

const ProductForm = () => {
  const { products, setProducts, setNotification } = useStore()
  const [productName, setProductName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName }
    productService.create(product)
      .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
      }).catch(e => {
        console.log(e)
        setNotification('Kirjaudu sisään lisätäksesi tuotteita', 'error')
      })
    setProductName('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Notification />
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
