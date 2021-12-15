import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import { Container, Button, Form as Formo } from 'react-bootstrap'
import * as yup from 'yup'
import { useHistory } from 'react-router-dom'
import { useStore } from '../../store'
import { UserService } from '../../services/user'
import { ErrorResponse } from '../../types/requestResponses'

type RegisterFormValues = {
  username: string,
  password: string
}

type Props = {
  userService: UserService
}

const RegisterForm: React.FC<Props> = ({ userService }) => {
  const { setNotification, clearNotification } = useStore()
  const history = useHistory()
  useEffect(() => {
    clearNotification()
  }, [])

  const SignupSchema = yup.object().shape({
    username: yup.string().min(3, 'Nimen tulee olla vähintään 3 kirjainta pitkä').required('Käyttäjänimi vaaditaan'),
    password: yup.string().min(6, 'Salasanan tulee olla vähintään 6 kirjainta pitkä').required('Salasana vaaditaan')
  })

  const initialValues: RegisterFormValues = {
    username: '',
    password: ''
  }
  const onSubmit = async (values: RegisterFormValues, submitProps: FormikHelpers<RegisterFormValues>) => {
    await userService.createUser(values)
      .then((response) => {
        setNotification(response.message, 'success')
        submitProps.setSubmitting(false)
        submitProps.resetForm()
        setTimeout(() => {
          history.push('/login')
        }, 3000)
      })
      .catch((error: ErrorResponse) => {
        submitProps.setSubmitting(false)
        submitProps.resetForm()
        setNotification((error.message ? error.message : 'Tapahtui odottamaton virhe!'), 'error')
      })
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
          <div>
            <Container>
              <Form  >
                <h1>Rekisteröidy</h1>
                <Formo.Group>
                  <Formo.Label htmlFor="username">Käyttäjänimi: </Formo.Label>
                  <Formo.Control as={Field}
                    type="username"
                    name="username"
                    id="usernameInput"
                    className={'form-control' + (errors.username && touched.username ?
                      'input-error' : null)}
                  />
                  <ErrorMessage
                    name="username"
                    component="span"
                    className="error"
                  />
                </Formo.Group>
                <Formo.Group>
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
                </Formo.Group>
                <Button
                  id='registerSubmit'
                  type="submit"
                  className={!(dirty && isValid) ? 'disabled-btn' : ''}
                  disabled={!(dirty && isValid)}
                >
                  Rekisteröidy
                </Button>
              </Form>
            </Container>
          </div>
        )
      }}
    </Formik>
  )
}

export default RegisterForm
