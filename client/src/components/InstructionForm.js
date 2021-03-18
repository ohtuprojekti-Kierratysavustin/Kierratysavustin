import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
const InstructionForm = ({ id }) => {
  const [information, setInformation] = useState('')
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')
  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    const notify = (message, condition) => {
      setNotifcationMessage(message),
      setCodnitionValue(condition)
      setTimeout(() => {
        setNotifcationMessage(null)
      }, 5000)
    }
    try {
      productService.createInstruction(id, instruction)
    } catch (e) {
      console.log(e)
      notify('Kirjaudu sisään lisätäksesi ohjeen', 'error')
    }


  }
  return (
    <div>
      <Notification message={notificationMessage} condition={conditionValue} />
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
