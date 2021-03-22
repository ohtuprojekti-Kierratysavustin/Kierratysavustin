import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'
import { useHistory } from 'react-router-dom'

const ProductForm = () => {
  const { products, setProducts } = useStore()
  const [productName, setProductName] = useState('')
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')
  const history = useHistory()

  const notify = (message, condition) => {
    setNotifcationMessage(message),
    setCodnitionValue(condition)
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName }
    productService.create(product)
      .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
        // Ilmoitus:
        //notify('Tuotteen lisäys onnistui', 'succes')
        //
        // tai uudelleenohjaus
        history.push('/products')
      }).catch(e => {
        console.log(e)
        notify('Kirjaudu sisään lisätäksesi tuotteita', 'error')
      })
    setProductName('')
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
        <button id="addproductBtn" type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
