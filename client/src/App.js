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
        <Link style={padding} to="/kierratysavustin">tuotteet</Link>
        <Link style={padding} to="/kierratysavustin/new">lisää tuote</Link>
      </div>

      <h1>Kotitalouden kierrätysavustin</h1>

      <Switch>
        <Route path="/kierratysavustin/products/:id">
          <Product products={products} />
        </Route>
        <Route path="/kierratysavustin/new">
          <ProductForm />
        </Route>
        <Route path="/kierratysavustin">
          <ProductList products={products} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
