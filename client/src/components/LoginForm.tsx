import React, { useEffect, useState } from 'react'
import productService from '../services/products'
import userService from '../services/user'
import tokenService from '../services/token'
import countService from '../services/productUserCount'
import { useStore } from '../store'
import { useHistory } from 'react-router-dom'

import { Container, Button, Form } from 'react-bootstrap'

const LoginForm = () => {
  const { setUser, setNotification, clearNotification, setFavorites, setLikes, setDislikes, setRecyclingStats } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  useEffect(() => {
    clearNotification()
  }, [])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (values) => {
    values.preventDefault()
    await userService.loginUser({ username: username, password: password })
      .then((user) => {
        setUser(user)
        tokenService.setToken(user.token)
        window.localStorage.setItem(
          'loggedUser', JSON.stringify(user)
        )
        productService.getFavorites(user.id)
          .then(favorites => setFavorites(favorites))
          .catch((error) => {
            setNotification((error.response.data.message ? error.response.data.message : 'Odottamaton virhe haettaessa suosikkituotteita!'), 'error')
          })
        userService.getLikes()
          .then(likes => setLikes(likes))
          .catch((error) => {
            setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe haettaessa tykkäyksiä!'), 'error')
          })
        userService.getDislikes()
          .then(dislikes => setDislikes(dislikes))
          .catch((error) => {
            setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe haettaessa tykkäyksiä!'), 'error')
          })
        countService.getUserCounts()
          .then(counts => setRecyclingStats(counts))
          .catch((error) => {
            setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe haettaessa kierrätystatistiikkaa'), 'error')
          })
        setNotification('Kirjautuminen onnistui', 'success')
        history.push('/')
      })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Väärä nimi tai salasana'), 'error')
      })

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
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">Salasana: </Form.Label>
            <Form.Control
              type="password"
              name="password"
              id="passwordInput"
              onChange={({ target }) => setPassword(target.value)}
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
  )
}
export default LoginForm
