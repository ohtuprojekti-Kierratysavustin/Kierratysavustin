import React from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'


import ProductForm from './components/ProductForm'
import Product from './components/Product'
import ProductList from './components/ProductList'


const App = (props) => {
  const { products } = props

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">tuotteet</Link>
        <Link style={padding} to="/new">lisää tuote</Link>
      </div>

      <h1>Kotitalouden kierrätysavustin</h1>

      <Switch>
        <Route path="/products/:id">
          <Product products={products} />
        </Route>
        <Route path="/new">
          <ProductForm />
        </Route>
        <Route path="/">
          <ProductList products={products} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
