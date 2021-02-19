import React, { useState } from 'react'

const InstructionForm = () => {
  const [Information, setInformation] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(Information)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
            Kierrätys ohje:
          <input
            type='text'
            value={Information}
            onChange={({ target }) => setInformation(target.value)}
          />
        </label>
        <br/>
        <button type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default InstructionForm
