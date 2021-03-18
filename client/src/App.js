import React, { useEffect } from 'react'
import {
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'
import productService from './services/products'
import create from 'zustand'
import ProductForm from './components/ProductForm'
import Product from './components/Product'
import ProductList from './components/ProductList'
import RegisterForm from './components/RegisterForm'
import SearchForm from './components/SearchForm'

export const useStore = create(set => ({
  products: [],
  filteredProducts: [],
  setProducts: (param) => set(() => ({ products: param })),
  setFilteredProducts: (param) => set(() => ({ filteredProducts: param })),
  updateProduct: (param) => set(state => ({
    ...state,
    products: state.products.map(p => p.id !== param.id ? p : param)
  }))
}))

const App = () => {
  const { products, setProducts, filteredProducts } = useStore()
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
        <Link style={padding} to="/">etusivu</Link>
        <Link id='productForm' style={padding} to="/new">lisää tuote</Link>
        <Link id='productList' style={padding} to="/products">tuotteet</Link>
        <Link style={padding} to="/register">rekisteröidy</Link>
      </div>

      <h1>Kotitalouden kierrätysavustin</h1>
      <Switch>
        <Route path="/products/:id">
          <Product product={product} />
        </Route>
        <Route path="/new">
          <ProductForm />
        </Route>
        <Route path="/register">
          <RegisterForm />
        </Route>
        <Route path="/products">
          <ProductList products={products}/>
        </Route>
        <Route path="/searchResults">
          <ProductList products={filteredProducts} />
        </Route>
        <Route path="/">
          <SearchForm />
        </Route>
      </Switch>
    </div>
  )
}

export default App
