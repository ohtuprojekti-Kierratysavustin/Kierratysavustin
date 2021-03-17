import React, { useState } from 'react'
import productService from '../services/products'

const ProductForm = ({ products, setProducts }) => {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  //const [products, setProducts] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName, description }
    productService.create(product).then(returnedProduct => {
      setProducts(products.concat(returnedProduct))
    })
    //setProducts(p => p.concat(products))
    console.log(setProducts)
    setProductName('')
    setDescription('')
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
        <label>
          Tuotteen selitys
          <input id="descriptionInput"
            type='text'
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </label>
        <br />
        <button id="addproductBtn" type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
