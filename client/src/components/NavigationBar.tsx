import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import {
  Link
} from 'react-router-dom'
import tokenService from '../services/token'
import { useStore } from '../store'
import '../styles.css'
import logo from '../media/logo.png'

const NavigationBar = () => {
  const { user, setUser, setProductStatistics } = useStore()
  return(
    <Navbar id = 'navbar'  expand='sm'>
      <Navbar.Brand as={Link} to="/">
        <img
          src={logo}
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className='mr-auto'>
          {user !== null
            ? (<Nav.Link id='productForm' as={Link} to="/new">Lisää tuote</Nav.Link>)
            : ('')}
          <Nav.Link id='productList' as={Link} to="/products">Tuotteet</Nav.Link>
          <Nav.Link id='recyclingStats' as={Link} to="/statistics">Kierrätyslaskuri</Nav.Link>
          <Nav.Link id='recycleLocations' as={Link} to="/recycleLocations">Kierrätyspisteet</Nav.Link>
        </Nav>

        {user !== null ? (
          <Nav className='justify-content-end'>
            <Navbar.Text>
              <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link id='LogoutButton' as={Link} onClick={() => {
              window.localStorage.clear()
              setUser(null)
              tokenService.removeToken()
              setProductStatistics([])
            }} to="/">   Kirjaudu ulos
            </Nav.Link>
          </Nav>
        ) : (
          <Nav className='justify-content-end'>
            <Nav.Link id='registerButton' as={Link} to="/register">Rekisteröidy</Nav.Link>
            <Nav.Link id='loginButton' as={Link} to="/login">Kirjaudu</Nav.Link>
          </Nav>
        )}

      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar
