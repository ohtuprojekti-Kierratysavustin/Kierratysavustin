import React from 'react'
import ProductForm from './components/ProductForm'
import Product from './components/Product'

const App = (props) => {
  const { products } = props

  return (
    <div>
      <h1>Kotitalouden kierrätysavustin</h1>
      <h2>Tuotteet</h2>
      <ul>
        {products.map(product =>
          <li key={product.id}>
            <Product product={product} />
          </li>
        )}
      </ul>
      <ProductForm/>
    </div>
  )
}

export default App
