import React from 'react'
import InstructionForm from './InstructionForm'
import { useStore } from '../App'

/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const { user } = useStore()
  if (!product) return null
  return (
    <div>
      <h2>{product.name}</h2>
      {product.instructions.map(info =>
        <li id ="productInstruction" key={info.id}>{info.information}</li>
      )}

      {user !== null ? (
        <div>
          <h2>Lisää tuotteelle kierrätysohje</h2>
          <InstructionForm product = {product}/>
        </div>
      ) : (
        ''
      )}


    </div>
  )
}

export default Product