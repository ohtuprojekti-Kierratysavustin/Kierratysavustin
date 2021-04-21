import React from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useStore } from '../App'


import {  Form as Formo, Button, Container, } from 'react-bootstrap'

const InstructionForm = ({ product, handleClose }) => {

  const { updateProduct, setNotification } = useStore()
  const notify = (message ) => {
    setNotification(message),
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  const InstructionSchema = yup.object().shape({
    instructionText: yup.string().min(3, 'Ohjeen tulee olla vähintään 3 kirjainta pitkä').max(500, 'Ohje saa olla enintään 500 merkkiä pitkä').required('Ohje vaaditaan'),
  })

  const initialValues = {
    instructionText: ''
  }
  const handleSubmit = async (values) => {
    const information = values.instructionText
    const info = { information }
    productService.createInstruction(product.id, info)
      .then(i => {
        product.instructions.push(i)
        product.instructions.sort((a,b) => b.score - a.score)
        updateProduct(product)
        handleClose()
        setNotification('Ohje lisätty!', 'success')
      }).catch(e => {
        console.log(e)
        notify('Ohjeen lisääminen ei onnistunut', 'error')
      })
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={InstructionSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik
        return (
          <div>
            <Formo as={Form} >
              <Container>
                <Notification />
                <Formo.Group>
                  <Formo.Label htmlFor="instructionText">kierrätysohje</Formo.Label>
                  <Formo.Control as={Field}
                    type='text'
                    name='instructionText'
                    id="instructionText"
                    rows={5}
                    cols={100}
                    className={errors.instructionText && touched.instructionText ?
                      'input-error' : null}
                  />

                  <ErrorMessage name="instructionText" component="span" className="error" />
                </Formo.Group>
                <Button
                  id="addInstruction"
                  type='submit'
                  className={!(dirty && isValid) ? 'disabled-btn' : ''}
                  disabled={!(dirty && isValid)}
                >lisää</Button>
              </Container>
            </Formo>
          </div>

        )
      }}
    </Formik>
  )
}


export default InstructionForm
