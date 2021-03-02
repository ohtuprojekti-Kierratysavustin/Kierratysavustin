import React, { useState } from 'react'
import productService from '../services/products'
const InstructionForm = ({ id }) => {
  const [information, setInformation] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    productService.createInstruction(id,instruction)

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
            Kierrätys ohje:
          <input id="instructionInput"
            type='text'
            value={information}
            onChange={({ target }) => setInformation(target.value)}
          />
        </label>
        <br/>
        <button id="addInstruction" type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default InstructionForm
