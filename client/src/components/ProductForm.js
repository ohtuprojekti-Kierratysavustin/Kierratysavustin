import React, { useState } from 'react'

const ProductForm = () => {
  const [productName, setProductName] = useState('')
  const [instruction, setInstruction] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    //const product = { productName,recycleInfo }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
            Tuotteen nimi
          <input
            type='text'
            value={productName}
            onChange={({ target }) => setProductName(target.value)}
          />
        </label>
        <br/>
        <label>
            Tuotteen selitys
          <input
            type='text'
            value={instruction}
            onChange={({ target }) => setInstruction(target.value)}
          />
        </label>
        <br/>
        <button type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
