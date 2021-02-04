import React from 'react'

const App = (props) => {
  const { products } = props

  return (
    <div>
      <h1>Kotitalouden kierrätysavustin</h1>
      <h2>Tuotteet</h2>
      <ul>
        {products.map(product =>
          <li key={product.id}>
            {product.name} <button onClick={() =>
              window.alert(`${product.name} - ${product.instructions}`
              )}>Näytä kierrätysohje</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
