import React, { useEffect } from 'react'
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom'
import userService from './services/user'
import NavigationBar from './components/NavigationBar'
import productService from './services/products'
import tokenService from './services/token'
import ProductForm from './components/ProductForm'
import ProductPage from './components/Product'
import ProductList from './components/ProductList'
import RegisterForm from './components/RegisterForm'
import ProductFilterForm from './components/FrontPage'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import RecycleStatistics from './components/RecycleStatistics'
import { useStore } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const { products, setProducts, filteredProducts, setFilteredProducts, setUser, setFavorites, setLikes, setDislikes } = useStore()

  useEffect(() => {
    productService.getAll().then(p => setProducts(p))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const userlogin = JSON.parse(loggedUserJSON)
      setUser(userlogin)
      tokenService.setToken(userlogin.token)
      productService.getFavorites(userlogin.id).then(favorites => setFavorites(favorites))
      userService.getLikes().then(likes => setLikes(likes))
      userService.getDislikes().then(dislikes => setDislikes(dislikes))
    }
  }, [])

  const match = useRouteMatch<{id: string}>('/products/:id')
  const product = match
    ? products.find(p => p.id.toString() === match.params.id)
    : undefined

  return (
    <div id='background'>
      <NavigationBar/>
      <Notification/>
      <Switch >
        <Route path="/products/:id">
          <ProductPage product={product} />
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
          <ProductList products={products} setFilteredProducts={setFilteredProducts} />
        </Route>
        <Route path="/searchResults">
          <ProductList products={filteredProducts} setFilteredProducts={setFilteredProducts} />
        </Route>
        <Route path="/statistics">
          <RecycleStatistics />
        </Route>
        <Route path="/">
          <ProductFilterForm products={products} setFilteredProducts={setFilteredProducts} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
