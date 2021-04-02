import React from 'react'
import {
  Link
} from 'react-router-dom'

const FavouriteProducts = ({ userProducts }) => {


  return (
    <div>
      <h2>Suosikki tuotteet</h2>
      <ul>
        {userProducts.map(product =>
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default FavouriteProducts