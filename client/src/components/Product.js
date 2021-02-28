import React from 'react'
import InstructionForm from './InstructionForm'


/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  if (!product) return null
  return (
    <div>
      <p> <b>{product.name}:</b></p>

      {product.instructions.map(info =>
        <li key={info.id}>{info.information}</li>
      )}
      <h2>Lisää tuotteelle kierrätys ohje</h2>

      <InstructionForm id = {product.id}/>
    </div>
  )
}


export default Product