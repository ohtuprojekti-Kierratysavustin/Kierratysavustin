import React from 'react'
// import loginService from '../services/login'
import { Formik, Form, Field, ErrorMessage  } from 'formik'

const LoginForm = () => {


  const initialValues = {
    username: '',
    password: ''
  }
  const onSubmit = (values) => {
    console.log(values)
    // loginService (tekee jotain)
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
          </div>
        )
      }}
    </Formik>
  )
}
export default LoginForm
