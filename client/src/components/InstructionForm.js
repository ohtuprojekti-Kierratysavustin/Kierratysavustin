import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

const InstructionForm = ({ product }) => {
  const [information, setInformation] = useState('')
  const updateProduct = useStore().updateProduct
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')

  const notify = (message, condition) => {
    setNotifcationMessage(message),
    setCodnitionValue(condition)
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    productService.createInstruction(product.id, instruction)
      .then(i => {
        product.instructions.push(i)
        updateProduct(product)
      }).catch(e => {
        console.log(e)
        notify('Kirjaudu sisään lisätäksesi kierrätysohje', 'error')
      })
    setInformation('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Notification message={notificationMessage} condition={conditionValue} />
        <label>
            Kierrätysohje:
          <input id="instructionInput"
            type='text'
            value={information}
            onChange={({ target }) => setInformation(target.value)}
          />
        </label>
        <br />
        <button id="addInstruction" type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default InstructionForm
