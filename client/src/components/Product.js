import React from 'react'


/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  if (!product) return null

  return (
    <div>

      <p> <b>({product.id}) {product.name}:</b></p>

      {product.instructions}

    </div>
  )
}


export default Product