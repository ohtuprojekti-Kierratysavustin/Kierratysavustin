import React, { useState } from 'react'

const ProductForm = () => {
  const [productName, setProductName] = useState('')
  const [recycleInfo, setRecycleInfo] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    //const product = { productName,recycleInfo }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
            Product name
          <input
            type='text'
            value={productName}
            onChange={({ target }) => setProductName(target.value)}
          />
        </label>
        <label>
            Recycle instruction
          <input
            type='text'
            value={recycleInfo}
            onChange={({ target }) => setRecycleInfo(target.value)}
          />
        </label>
        <button type='submit'>lisää</button>
      </form>
    </div>
  )
}
export default ProductForm
