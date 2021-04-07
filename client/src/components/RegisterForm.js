import React, { useEffect } from 'react'
import registerService from '../services/register'
import Notification from './Notification'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import { Row, Col,Container,Button, Form as Formo } from 'react-bootstrap'
import * as yup from 'yup'
import { useStore } from '../App'
const RegisterForm = () => {
  const { setNotification, clearNotification } = useStore()

  useEffect(() => {
    clearNotification()
  }, [])

  const SignupSchema = yup.object().shape({
    username: yup.string().min(2, 'Nimen tulee olla vähintään 2 kirjainta pitkä').required('Käyttäjänimi vaaditaan'),
    password: yup.string().min(6, 'Salasanan tulee olla vähintään 6 kirjainta pitkä').required('Salasana vaaditaa')
  })

  const initialValues = {
    username: '',
    password: ''
  }

  const onSubmit =  async (values) => {
    try {
      await registerService.createUser(values)
      setNotification('Rekisteröityminen onnistui', 'success')
    } catch (error) {
      setNotification('Käyttäjätunnus on jo käytössä', 'error')
    }
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
                    <label htmlFor="username">Käyttäjänimi: </label>
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
                    <label htmlFor="password">Salasana: </label>
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





export default RegisterForm
