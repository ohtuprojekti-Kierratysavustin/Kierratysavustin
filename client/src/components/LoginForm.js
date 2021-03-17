import React , { useState } from 'react'
import loginService from '../services/login'
import productService from '../services/products'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import Notification from './Notification'
const LoginForm = () => {
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')
  const notify = (message, condition) => {
    setNotifcationMessage(message),
    setCodnitionValue(condition)
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)
  }

  const initialValues = {
    username: '',
    password: ''
  }
  const onSubmit = async(values) => {
    event.preventDefault()
    try {
      const user = await loginService.loginUser(values)
      productService.setToken(user.data.token)
      notify('Kirjautuminen onnistui', 'succes')
    } catch (e) {
      notify('Väärä nimi tai salasana', 'error')
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
                type="submit"
                className={!(dirty && isValid) ? 'disabled-btn' : ''}
                disabled={!(dirty && isValid)}
              >
              Log In
              </button>
            </Form>
            <Notification message={notificationMessage} condition={conditionValue} />
          </div>
        )
      }}
    </Formik>
  )
}
export default LoginForm
