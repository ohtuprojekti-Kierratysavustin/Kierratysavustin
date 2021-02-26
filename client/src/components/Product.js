import React from 'react'
import InstructionForm from './InstructionForm'
import SearchForm from './SearchForm'


/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  if (!product) return null
  return (
    <div>
      <p> <b>{product.name}:</b></p>
      <li>
        {product.instructions.map(info =>
          <p key={info.id}>{info.information}</p>
        )}
      </li>
      <h2>Lisää tuotteelle kierrätys ohje</h2>

      <InstructionForm id = {product.id}/>
      <SearchForm />
    </div>
  )
}


export default Product