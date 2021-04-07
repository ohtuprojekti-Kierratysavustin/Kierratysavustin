import React, { useEffect } from 'react'
import loginService from '../services/login'
import productService from '../services/products'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import Notification from './Notification'
import { useStore } from '../App'

import { Container , Row, Button, Col, Form as Formo } from 'react-bootstrap'

const LoginForm = () => {
  const { setUser, setNotification, clearNotification, setFavorites } = useStore()

  useEffect(() => {
    clearNotification()
  }, [])

  const initialValues = {
    username: '',
    password: ''
  }
  const onSubmit = async(values) => {
    try {
      const user = await loginService.loginUser(values)
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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik
        return (

          <div>
            <Form  >
              <Container>
                <Row>
                  <Col>
                    <h1>Kirjaudu sisään</h1>
                  </Col>
                </Row>
                <Notification />
                <Row>
                  <Col>
                    <Formo.Label htmlFor="username">Käyttäjänimi: </Formo.Label>
                    <Formo.Control as={Field}
                      type="username"
                      name="username"
                      id="usernameInput"
                      className={'form-control' + (errors.username && touched.username ?
                        'input-error' : null)}
                    />
                    <ErrorMessage name="username" component="span" className="error" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Formo.Label htmlFor="password">Salasana: </Formo.Label>
                    <Formo.Control as={Field}
                      type="password"
                      name="password"
                      id="passwordInput"
                      className={'form-control' + (errors.password && touched.password ?
                        'input-error' : null)}
                    />
                    <ErrorMessage
                      name="password"
                      component="span"
                      className="error"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      id='loginSubmit'
                      type="submit"
                      className={!(dirty && isValid) ? 'disabled-btn' : ''}
                      disabled={!(dirty && isValid)}
                    >
                    Kirjaudu
                    </Button>


                  </Col>
                </Row>
              </Container>
            </Form>
          </div>
        )
      }}
    </Formik>
  )
}
export default LoginForm
