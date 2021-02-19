import React from 'react'
import {
  useParams
} from 'react-router-dom'
import InstructionForm from './InstructionForm'

/** Component for showing product name and recycling information. */
const Product = (props) => {
  const id = useParams().id
  const { products } = props
  const product = products[id - 1]
  //console.log(product)
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