import React from 'react'
import InstructionForm from './InstructionForm'


/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  if (!product) return null

  return (
    <div>

      <p> <b>({product.id}) {product.name}:</b></p>

      {product.instructions}
      <h2>Lisää tuotteelle kierrätys ohje</h2>

      <InstructionForm />
    </div>
  )
}


export default Product