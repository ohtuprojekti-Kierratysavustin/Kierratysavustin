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
import LoginForm from './components/LoginForm'

import image from './media/logo.png'
import { Navbar, Nav, Container, Col, Row, Jumbotron, Media, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export const useStore = create(set => ({
  products: [],
  filteredProducts: [],
  favorites: [],
  user: null,
  notification: { message: null, condition: null },
  timer: null,
  setUser: (param) => set(() => ({ user: param })),
  setProducts: (param) => set(() => ({ products: param })),
  setFavorites: (param) => set(() => ({ favorites: param })),
  setFilteredProducts: (param) => set(() => ({ filteredProducts: param })),
  clearNotification: () => set(() => ({ notification: { message: null, condition: null } })),
  setNotification: (message, condition) => set(state => ({
    ...state,
    clearTimer: clearTimeout(state.timer),
    notification: { message, condition },
    timer: setTimeout(() => {
      state.clearNotification() }, 5000)
  })),
  updateProduct: (param) => set(state => ({
    ...state,
    products: state.products.map(p => p.id !== param.id ? p : param)
  }))
}))

const App = () => {
  const { products, setProducts, filteredProducts, setFilteredProducts, user, setUser, setFavorites } = useStore()

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
    }
  }, [])

  const match = useRouteMatch('/products/:id')
  const product = match
    ? products.find(p => p.id === match.params.id)
    : null

  if(user === null){
    return(
      <div>

        <Navbar bg='secondary' expand='lg'>
          <Navbar.Brand as={Link} to="/">etusivu</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='mr-auto'>
              <Nav.Link id='productList' as={Link} to="/products">tuotteet</Nav.Link>
            </Nav>
            <Nav className='justify-content-end'>
              <Nav.Link id='registerButton' as={Link} to="/register">rekisteröidy</Nav.Link>
              <Nav.Link id='loginButton' as={Link} to="/login">kirjaudu</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Jumbotron>
          <Media>
            <Image
              width={128}
              height={128}
              className='mr-3'
              src={image}
              alt='Logo'
            />
            <Media.Body>
              <h2>Kotitalouden kierrätysavustin</h2>
              <p>
                kierrätysavustimesta lyhyesti
              </p>
            </Media.Body>
          </Media>
        </Jumbotron>

        <Container>
          <Row>
            <Col>
              <Switch>
                <Route path="/products/:id">
                  <Product product={product} />
                </Route>
                <Route path="/register">
                  <RegisterForm />
                </Route>
                <Route path="/login">
                  <LoginForm />
                </Route>
                <Route path="/products">
                  <ProductList products={products}/>
                </Route>
                <Route path="/searchResults">
                  <ProductList products={filteredProducts} />
                </Route>
                <Route path="/">
                  <SearchForm products={products} setFilteredProducts={setFilteredProducts} />
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
  return (
    <div>
      <Navbar bg='secondary' expand='lg'>
        <Navbar.Brand as={Link} to="/">etusivu</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='mr-auto'>
            <Nav.Link id='productForm' as={Link} to="/new">lisää tuote</Nav.Link>
            <Nav.Link id='productList' as={Link} to="/products">tuotteet</Nav.Link>
          </Nav>
          <Nav className='justify-content-end'>
            <Nav.Link id='LogoutButton' as={Link} onClick={() => {
              window.localStorage.clear()
              setUser(null)
              productService.removeToken()
            }} to="/">kirjaudu ulos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Jumbotron>
        <Media>
          <Image
            width={128}
            height={128}
            className='mr-3'
            src={image}
            alt='Logo'
          />
          <Media.Body>
            <h2>Kotitalouden kierrätysavustin</h2>
            <p>
                kierrätysavustimesta lyhyesti
            </p>
          </Media.Body>
        </Media>
      </Jumbotron>

      <Container>
        <Row>
          <Col>
            <Switch>
              <Route path="/products/:id">
                <Product product={product} />
              </Route>
              <Route path="/new">
                <ProductForm />
              </Route>
              <Route path="/products">
                <ProductList products={products}/>
              </Route>
              <Route path="/searchResults">
                <ProductList products={filteredProducts} />
              </Route>
              <Route path="/">
                <SearchForm products={products} setFilteredProducts={setFilteredProducts} />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
