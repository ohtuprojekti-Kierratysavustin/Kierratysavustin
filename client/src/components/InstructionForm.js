import React from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useStore } from '../App'

const InstructionForm = ({ product }) => {
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
        updateProduct(product)
        notify('Ohjeen lisääminen onnistui', 'succes')
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
          <div className="container">

            <Form  >
              <div className="form-row">
                <label htmlFor="instructionText">Anna kierrätysohje: </label>
                <Field
                  type="text"
                  name="instructionText"
                  id="instructionText"
                  className={errors.instructionText && touched.instructionText ?
                    'input-error' : null}
                />
                <ErrorMessage name="instructionText" component="span" className="error" />

              </div>
              <button
                id="addInstruction"
                type="submit"
                className={!(dirty && isValid) ? 'disabled-btn' : ''}
                disabled={!(dirty && isValid)}
              >
              Lisää ohje
              </button>

            </Form>

            <Notification />

          </div>
        )
      }}
    </Formik>
  )
}
export default InstructionForm
