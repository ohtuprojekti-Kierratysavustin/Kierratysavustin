import React, { useEffect } from 'react'
import {
  Routes, Route, useMatch
} from 'react-router-dom'
import { userService } from './services/user'
import productService from './services/products'
import tokenService from './services/token'
import { kierratysInfoService } from './services/kierratysInfo'
import { statisticsService } from './services/statistics'
import { credentialService } from './services/credentials'
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
      statisticsService.getUserCumulativeRecyclingRatesPerProduct().then(stats => setProductStatistics(stats))
    }
  }, [])

  const match = useMatch('/products/:id')
  const product = match
    ? products.find(p => p.id.toString() === match.params.id)
    : undefined

  return (
    <div id='background'>
      <NavigationBar />
      <Notification />
      <Routes >
        <Route path="/products/:id" element={<ProductView product={product} statisticsService={statisticsService} />}>
        </Route>
        <Route path="/register" element={<RegisterForm userService={userService} />}>
        </Route>
        <Route path="/login" element={<LoginForm />}>
        </Route>
        <Route path="products/new" element={<ProductForm />}>
        </Route>
        <Route path="/products" element={<ProductListView products={products} setFilteredProducts={setFilteredProducts} />}>
        </Route>
        <Route path="/searchResults" element={<ProductListView products={filteredProducts} setFilteredProducts={setFilteredProducts} />}>
        </Route>
        <Route path="/statistics" element={<RecycleStatisticsView />}>
        </Route>
        <Route path="/recycleLocations" element={<RecycleLocationsView kierratysInfoService={kierratysInfoService} credentialService={credentialService} />}>
        </Route>
        <Route path="/" element={<ProductFilterForm products={products} setFilteredProducts={setFilteredProducts} />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App
