import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
const ProductForm = ({ products, setProducts }) => {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')
  const notify = (message, condition) => {
    setNotifcationMessage(message),
    setCodnitionValue(condition)
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)
  }
  //const [products, setProducts] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName, description }
    productService.create(product)
      .catch(e => {
        console.log(e)
        notify('Kirjaudu sisään lisätäksesi tuotteita', 'error')
      }).then(returnedProduct => {
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
        <Notification message={notificationMessage} condition={conditionValue} />
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
