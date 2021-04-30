import React, { useState } from 'react'
import productService from '../services/products'
//import Notification from './Notification'
import { Formik, Form, ErrorMessage, useField } from 'formik'
import * as yup from 'yup'
import { useStore } from '../App'

import {  Form as Formo, Button,  Modal } from 'react-bootstrap'

const InstructionForm = ({ product }) => {
  const [modalShow, setModalShow] = useState(false)

  const handleClose = () => setModalShow(false)
  const handleShow = () => setModalShow(true)

  return (
    <div>
      <Button
        id='instructionButton'
        variant="primary"
        onClick={() => handleShow(true)}
      >
        Lisää uusi ohje
      </Button>
      <InstructionPopup
        show={modalShow}
        onHide={() => handleClose(false)}
        product={product}
        handleClose={handleClose}
      />
    </div>
  )
}

const TextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}


const InstructionPopup = ( props ) =>  {
  const { updateProduct, setNotification } = useStore()
  const notify = (message ) => {
    setNotification(message),
    setTimeout(() => {
      setNotification(null)
    }, 10000)
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
    productService.createInstruction(props.product.id, info)
      .then(i => {
        props.product.instructions.push(i)
        props.product.instructions.sort((a,b) => b.score - a.score)
        updateProduct(props.product)
        values.instructionText = ''
        props.handleClose()
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

          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Uusi ohje tuotteelle
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formo as={Form} >
                <Formo.Group>
                  <Formo.Label htmlFor="instructionText">kierrätysohje</Formo.Label>
                  <Formo.Control as={TextArea}
                    type='textarea'
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
                //onClick={() => handleSubmit()}
                >lisää</Button>
              </Formo>
            </Modal.Body>
          </Modal>
        )
      }}
    </Formik>
  )
}


export default InstructionForm
