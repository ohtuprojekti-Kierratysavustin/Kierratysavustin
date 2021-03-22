import React from 'react'
import loginService from '../services/login'
import productService from '../services/products'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import Notification from './Notification'
import { useStore } from '../App'

const LoginForm = () => {
  const { setUser, setNotification } = useStore()

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
          <div className="container">
            <h1>Kirjaudu sisään</h1>
            <Form  >
              <div className="form-row">
                <label htmlFor="username">Käyttäjänimi: </label>
                <Field
                  type="username"
                  name="username"
                  id="usernameInput"
                  className={errors.username && touched.username ?
                    'input-error' : null}
                />
                <ErrorMessage name="username" component="span" className="error" />
              </div>

              <div className="form-row">
                <label htmlFor="password">Salasana: </label>
                <Field
                  type="password"
                  name="password"
                  id="passwordInput"
                  className={errors.password && touched.password ?
                    'input-error' : null}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="error"
                />
              </div>
              <button
                id='loginSubmit'
                type="submit"
                className={!(dirty && isValid) ? 'disabled-btn' : ''}
                disabled={!(dirty && isValid)}
              >
              Kirjaudu
              </button>
            </Form>
            <Notification />
          </div>
        )
      }}
    </Formik>
  )
}
export default LoginForm
