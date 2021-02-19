import React from 'react'
import {
  Link
} from 'react-router-dom'

/** Component for showing list of products and a link to product page */
const ProductList = ({ products }) => {
  console.log(products)
  return (
    <div>
      <h2>Tuotteet</h2>
      <ul>
        {products.map(product =>
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        )}
      </ul>

    </div>
  )
}


export default ProductList