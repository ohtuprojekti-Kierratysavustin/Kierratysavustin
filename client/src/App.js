import React, { useEffect } from 'react'
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import productService from './services/products'
import create from 'zustand'
import ProductForm from './components/ProductForm'
import Product from './components/Product'
import ProductList from './components/ProductList'
import RegisterForm from './components/RegisterForm'
import SearchForm from './components/SearchForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

export const useStore = create(set => ({
  products: [],
  prod:null,
  filteredProducts: [],
  favorites: [],
  likes:[],
  dislikes: [],
  user: null,
  notification: { message: null, condition: null },
  timer: null,
  setUser: (param) => set(() => ({ user: param })),
  setProducts: (param) => set(() => ({ products: param })),
  setProduct: (param) => set(() => ({ prod: param })),
  setFavorites: (param) => set(() => ({ favorites: param })),
  setLikes: (param) => set(() => ({ likes: param })),
  setDislikes: (param) => set(() => ({ dislikes: param })),
  setFilteredProducts: (param) => set(() => ({ filteredProducts: param })),
  clearNotification: () => set(() => ({ notification: { message: null, condition: null } })),
  setNotification: (message, condition) => set(state => ({
    ...state,
    clearTimer: clearTimeout(state.timer),
    notification: { message, condition },
    timer: setTimeout(() => {
      state.clearNotification() }, 10000)
  })),
  updateProduct: (param) => set(state => ({
    ...state,
    products: state.products.map(p => p.id !== param.id ? p : param)
  }))
}))

const App = () => {
  const { products, setProducts, filteredProducts, setFilteredProducts, setUser, setFavorites,setLikes,setDislikes } = useStore()

  useEffect(() => {
    productService.getAll().then(p => setProducts(p))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const userlogin = JSON.parse(loggedUserJSON)
      setUser(userlogin)
      productService.setToken(userlogin.token)
      productService.getFavorites(userlogin.id).then(favorites => setFavorites(favorites))
      productService.getLikes().then(likes => setLikes(likes))
      productService.getDislikes().then(dislikes => setDislikes(dislikes))
    }
  }, [])

  const match = useRouteMatch('/products/:id')
  const product = match
    ? products.find(p => p.id === match.params.id)
    : null

  return (
    <div id='background'>
      <NavigationBar/>
      <Notification/>
      <Switch >
        <Route path="/products/:id">
          <Product product={product} />
        </Route>
        <Route path="/register">
          <RegisterForm />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/new">
          <ProductForm />
        </Route>
        <Route path="/products">
          <ProductList products={products} setFilteredProducts={setFilteredProducts}/>
        </Route>
        <Route path="/searchResults">
          <ProductList products={filteredProducts} />
        </Route>
        <Route path="/">
          <SearchForm products={products} setFilteredProducts={setFilteredProducts} />
        </Route>
      </Switch>
    </div>
  )

}

export default App
