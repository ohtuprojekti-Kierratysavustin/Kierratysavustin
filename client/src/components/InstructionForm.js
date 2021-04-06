import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

const InstructionForm = ({ product }) => {
  const [information, setInformation] = useState('')
  const { updateProduct, setNotification } = useStore()
  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    productService.createInstruction(product.id, instruction)
      .then(i => {
        product.instructions.push(i)
        updateProduct(product)
        setNotification('Ohje lisätty!', 'success')
      }).catch(e => {
        console.log(e)
        setNotification('Kirjaudu sisään lisätäksesi kierrätysohje', 'error')
      })
    setInformation('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Notification />
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
