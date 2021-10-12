import React, { useState } from 'react'
import productService from '../services/products'
import { Formik, Form, useField } from 'formik'
import * as yup from 'yup'
import { useStore } from '../store'
import {  Form as Formo, Button,  Modal } from 'react-bootstrap'
import { Product } from '../types'

type InstructionFormProps = {
  product: Product
}

const InstructionForm: React.FC<InstructionFormProps> = ({ product }) => {
  const [modalShow, setModalShow] = useState(false)

  const handleClose = () => {
    setModalShow(false)
  }
  const handleShow = () => setModalShow(true)

  return (
    <div>
      <Button
        id='instructionButton'
        variant="primary"
        onClick={() => handleShow()}
      >
        Lisää uusi ohje
      </Button>
      <InstructionPopup
        show={modalShow}
        onHide={() => handleClose()}
        product={product}
        handleClose={handleClose}
      />
    </div>
  )
}

type TextAreaProps = {
  type: string | undefined,
  name: string,
  id: string | undefined,
  rows: number,
  cols: number
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const [field, meta] = useField(props)
  return (
    <>
      <textarea className="text-area" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}

type InstructionPopupProps = {
  show: boolean,
  onHide: () => void,
  product: Product,
  handleClose: () => void
}

type InstructionPopupValues = {
  instructionText: string
}

const InstructionPopup: React.FC<InstructionPopupProps> = ( props ) =>  {
  const { updateProduct, setNotification, clearNotification } = useStore()
  const notify = (message: string, condition: string) => {
    setNotification(message, condition),
    setTimeout(() => {
      clearNotification()
    }, 10000)
  }

  const InstructionSchema = yup.object().shape({
    instructionText: yup.string()
      .min(3, 'Ohjeen tulee olla vähintään 3 kirjainta pitkä')
      .max(500, 'Ohje saa olla enintään 500 merkkiä pitkä')
      .required('Ohje vaaditaan'),
  })

  const initialValues: InstructionPopupValues = {
    instructionText: ''
  }

  const handleSubmit = async (values: InstructionPopupValues) => {
    const information = values.instructionText
    const info = { information }
    productService.createInstruction(props.product.id, info)
      .then(response => {
        props.product.instructions.push(response.resource)
        props.product.instructions.sort((a, b) => b.score - a.score)
        updateProduct(props.product)
        values.instructionText = ''
        props.handleClose()
        setNotification(response.message, 'success')
      }).catch((error) => {
        notify((error.response.data.message ? error.response.data.message : 'Ohjetta lisättäessä tapahtui odottamaton virhe!'), 'error')
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
                Uusi kierrätysohje tuotteelle
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formo as={Form} >
                <Formo.Group>
                  <Formo.Control as={TextArea}
                    type='textarea'
                    name='instructionText'
                    id="instructionText"
                    rows={5}
                    cols={100}
                    className={errors.instructionText && touched.instructionText ?
                      'input-error' : undefined}
                  />
                </Formo.Group>
                <Button
                  id="addInstruction"
                  type='submit'
                  className={!(dirty && isValid) ? 'disabled-btn' : ''}
                  disabled={!(dirty && isValid)}
                //onClick={() => handleSubmit()}
                >Lisää</Button>
              </Formo>
            </Modal.Body>
          </Modal>
        )
      }}
    </Formik>
  )
}


export default InstructionForm
