import React, { useEffect, useState } from 'react'
import {
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'
import productService from './services/products'

import ProductForm from './components/ProductForm'
import Product from './components/Product'
import ProductList from './components/ProductList'
//import { set } from 'mongoose'

const App = () => {
  //const { products } = props
  const [products, setProducts] = useState([])
  useEffect(() => {
    productService.getAll().then(p => setProducts(p))
  }, [])

  const match = useRouteMatch('/products/:id')
  const product = match
    ? products.find(p => p.id === match.params.id)
    : null

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">tuotteet</Link>
        <Link style={padding} to="/new">lisää tuote</Link>
      </div>

      <h1>Kotitalouden kierrätysavustin</h1>

      <Switch>
        <Route path="/products/:id">
          <Product product={product} />
        </Route>
        <Route path="/new">
          <ProductForm />
        </Route>
        <Route path="/">
          <ProductList products={products} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
