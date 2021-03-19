import React, { useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'
const InstructionForm = ({ product }) => {
  const [information, setInformation] = useState('')
  const updateProduct = useStore().updateProduct
  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    productService.createInstruction(product.id, instruction)
      .then(i => {
        product.instructions.push(i)
        updateProduct(product)
      })
    setInformation('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
