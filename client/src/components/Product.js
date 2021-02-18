import React from 'react'
import {
  useParams
} from 'react-router-dom'

/** Component for showing product name and recycling information. */
const Product = (props) => {
  const id = useParams().id
  const { products } = props
  const product = products[id - 1]
  console.log(product)
  return (
    <div>

      <p> <b>({product.id}) {product.name}:</b></p>

      {product.instructions}

    </div>
  )
}


export default Product