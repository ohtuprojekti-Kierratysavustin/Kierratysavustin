import React from 'react'

/** Component for showing product name and button for opening the recycling information. */
const Product = (props) => {
  const { product } = props
  return (
    <div>

      <p> <b>({product.id}) {product.name}:</b></p>

      {product.instructions}

    </div>
  )
}


export default Product