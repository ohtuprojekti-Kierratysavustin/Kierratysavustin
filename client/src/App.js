import React from 'react'
import ProductForm from './components/ProductForm'
/** Component for showing product name and button for opening the recycling information. */
const Product = (props) => {
  const { product } = props
  return (
    <div>
      {product.name} <button onClick={() =>
        window.alert(`${product.name} - ${product.instructions}`
        )}>Näytä kierrätysohje</button>
    </div>
  )
}


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
