import React, { useEffect,useState } from 'react'
import loginService from '../services/login'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

import { Container, Button, Form } from 'react-bootstrap'

const LoginForm = () => {
  const { setUser, setNotification, clearNotification, setFavorites } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    clearNotification()
  }, [])

  const onSubmit = async(values) => {
    values.preventDefault()
    try {
      const user = await loginService.loginUser({ username:username, password:password })
      setUser(user)
      productService.setToken(user.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      productService.getFavorites(user.id).then(favorites => setFavorites(favorites))
      setNotification('Kirjautuminen onnistui', 'success')
    } catch (e) {
      setNotification('Väärä nimi tai salasana', 'error')
    }
  }
  return (

    <div>
      <Container>
        <Form onSubmit={onSubmit}>
          <h1>Kirjaudu sisään</h1>
          <Notification />
          <Form.Group>
            <Form.Label htmlFor="username">Käyttäjänimi: </Form.Label>
            <Form.Control
              type="username"
              name="username"
              id="usernameInput"
              onChange = {({ target }) => setUsername(target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">Salasana: </Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="passwordInput"
              onChange = {({ target }) => setPassword(target.value)}
            />

          </Form.Group>
          <Button
            id='loginSubmit'
            type="submit"
          >
                    Kirjaudu
          </Button>
        </Form>
      </Container>
    </div>
  )}
export default LoginForm
