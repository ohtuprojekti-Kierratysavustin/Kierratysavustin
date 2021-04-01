import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { Formik, Form, Field, ErrorMessage  } from 'formik'
import * as yup from 'yup'

const InstructionForm = ({ id }) => {
  const [notificationMessage, setNotifcationMessage] = useState(null)
  const [conditionValue, setCodnitionValue] = useState('error')
  const notify = (message, condition) => {
    setNotifcationMessage(message),
    setCodnitionValue(condition)
    setTimeout(() => {
      setNotifcationMessage(null)
    }, 5000)}
  const InstructionSchema = yup.object().shape({
    instructionText: yup.string().min(2, 'Ohjeen tulee olla vähintään 3 kirjainta pitkä').max(500, 'Ohje saa olla enintään 500 merkkiä pitkä').required('Ohje vaaditaan'),
  })

  const initialValues = {
    instructionText: '',
  }

  const handleSubmit =  async (values) => {
    const information = values.instructionText
    const info = { information }
    try {
      await productService.createInstruction(id, info)
      notify('Ohjeen lisääminen onnistui', 'succes')
    } catch (error) {
      notify('Ohjeen lisääminen ei onnistunut', 'error')
    }
  }

  return (
  // <div>
  //   <form onSubmit={handleSubmit}>
  //     <label>
  //         Kierrätysohje:
  //       <input id="instructionInput"
  //         type='text'
  //         value={information}
  //         onChange={({ target }) => setInformation(target.value)}
  //       />
  //     </label>
  //     <br/>
  //     <button id="addInstruction" type='submit'>lisää</button>
  //   </form>
  // </div>

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
                  id="instructionInput"
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

            <Notification message={notificationMessage} condition={conditionValue} />

          </div>
        )
      }}
    </Formik>
  )
}
export default InstructionForm
