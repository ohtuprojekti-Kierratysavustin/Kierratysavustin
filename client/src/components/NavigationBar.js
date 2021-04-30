import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import {
  Link
} from 'react-router-dom'
import tokenService from '../services/token'
import { useStore } from '../App'
import '../styles.css'

const NavigationBar = () => {
  const { user,setUser } = useStore()
  return(
    <Navbar id = 'navbar'  expand='sm'>
      <Navbar.Brand as={Link} to="/"> etusivu </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className='mr-auto'>
          {user !== null ? (
            <Nav.Link id='productForm' as={Link} to="/new">lisää tuote</Nav.Link>
          ) : (
            ''
          )}
          <Nav.Link id='productList' as={Link} to="/products">tuotteet</Nav.Link>
        </Nav>

        {user !== null ? (
          <Nav className='justify-content-end'>
            <Navbar.Text>
              <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link variant='outline-dark' id='LogoutButton' as={Link} onClick={() => {
              window.localStorage.clear()
              setUser(null)
              tokenService.removeToken()
            }} to="/">   kirjaudu ulos
            </Nav.Link>
          </Nav>
        ) : (
          <Nav className='justify-content-end'>
            <Nav.Link id='registerButton' as={Link} to="/register">rekisteröidy</Nav.Link>
            <Nav.Link id='loginButton' as={Link} to="/login">kirjaudu</Nav.Link>
          </Nav>
        )}

      </Navbar.Collapse>
    </Navbar>

  )
}

export default NavigationBar