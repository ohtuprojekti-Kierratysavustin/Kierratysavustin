import React, { useEffect } from 'react'
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom'
import { userService } from './services/user'
import productService from './services/products'
import tokenService from './services/token'
import { kierratysInfoService } from './services/kierratysInfo'
import { productUserCountService } from './services/productUserCount'
import NavigationBar from './components/NavigationBar'
import ProductForm from './components/forms/ProductForm'
import ProductView from './components/views/ProductView'
import ProductListView from './components/views/ProductListView'
import RegisterForm from './components/forms/RegisterForm'
import ProductFilterForm from './components/views/FrontPage'
import LoginForm from './components/forms/LoginForm'
import Notification from './components/Notification'
import RecycleStatisticsView from './components/views/RecycleStatisticsView'
import { useStore } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import RecycleLocationsView from './components/views/RecycleLocationsView'

const App = () => {
  const { products, setProducts, filteredProducts, setFilteredProducts, setUser, setFavorites, setLikes, setDislikes, setProductStatistics } = useStore()

  useEffect(() => {
    productService.getAll().then(p => setProducts(p))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const userlogin = JSON.parse(loggedUserJSON)
      setUser(userlogin)
      tokenService.setToken(userlogin.token)
      productService.getFavorites().then(favorites => setFavorites(favorites))
      userService.getLikes().then(likes => setLikes(likes))
      userService.getDislikes().then(dislikes => setDislikes(dislikes))
      productUserCountService.getUserCounts().then(stats => setProductStatistics(stats))
    }
  }, [])

  const match = useRouteMatch<{ id: string }>('/products/:id')
  const product = match
    ? products.find(p => p.id.toString() === match.params.id)
    : undefined

  return (
    <div id='background'>
      <NavigationBar />
      <Notification />
      <Switch >
        <Route path="/products/:id">
          <ProductView product={product} />
        </Route>
        <Route path="/register">
          <RegisterForm userService={userService} />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/new">
          <ProductForm />
        </Route>
        <Route path="/products">
          <ProductListView products={products} setFilteredProducts={setFilteredProducts} />
        </Route>
        <Route path="/searchResults">
          <ProductListView products={filteredProducts} setFilteredProducts={setFilteredProducts} />
        </Route>
        <Route path="/statistics">
          <RecycleStatisticsView />
        </Route>
        <Route path="/recycleLocations">
          <RecycleLocationsView kierratysInfoService={kierratysInfoService} />
        </Route>
        <Route path="/">
          <ProductFilterForm products={products} setFilteredProducts={setFilteredProducts} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
