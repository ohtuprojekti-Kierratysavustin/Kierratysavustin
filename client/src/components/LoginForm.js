import React, { useEffect,useState } from 'react'
import productService from '../services/products'
import userService from '../services/user'
import tokenService from '../services/token'
import { useStore } from '../store'
import { useHistory } from 'react-router-dom'

import { Container, Button, Form } from 'react-bootstrap'

const LoginForm = () => {
  const { setUser, setNotification, clearNotification, setFavorites, setLikes, setDislikes } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  useEffect(() => {
    clearNotification()
  }, [])

  const onSubmit = async(values) => {
    values.preventDefault()
    try {
      const user = await userService.loginUser({ username:username, password:password })
      setUser(user)
      tokenService.setToken(user.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      productService.getFavorites(user.id).then(favorites => setFavorites(favorites))
      userService.getLikes().then(likes => setLikes(likes))
      userService.getDislikes().then(dislikes => setDislikes(dislikes))
      setNotification('Kirjautuminen onnistui', 'success')
      history.push('/')
    } catch (e) {
      setNotification('Väärä nimi tai salasana', 'error')
    }
  }
  return (

    <div>
      <Container>
        <Form onSubmit={onSubmit}>
          <h1>Kirjaudu sisään</h1>
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
