import React, { useState } from 'react'
import registerService from '../services/register'
import Notification from './Notification'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import * as yup from 'yup'

const RegisterForm = () => {
  const [notificationMessage, setNotifcationMessage] = useState(null)

  const SignupSchema = yup.object().shape({
    username: yup.string().min(2, 'Nimen tulee olla vähintään 2 kirjainta pitkä').required('Käyttäjänimi vaaditaan'),
    password: yup.string().min(6, 'Salasanan tulee olla vähintään 6 kirjainta pitkä').required('Salasana vaaditaa')
  })

  const initialValues = {
    username: '',
    password: ''
  }
  const onSubmit = (values) => {
    registerService.createUser(values)

    setNotifcationMessage(
      `Käyttäjä '${values.username}' lisättiin serverille`
    )
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)
  }


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik
        return (
          <div className="container">
            <h1>Sign in to continue</h1>
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
              Sign In
              </button>
            </Form>

            <Notification message={notificationMessage} />

          </div>
        )
      }}
    </Formik>
  )
}
export default RegisterForm
