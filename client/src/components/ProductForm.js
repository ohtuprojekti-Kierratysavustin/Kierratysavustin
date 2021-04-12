import React, { useEffect } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage  } from 'formik'

const ProductForm = () => {
  const { products, setProducts, setNotification , clearNotification } = useStore()

  useEffect(() => {
    clearNotification()
  }, [])
  const ProductSchema = yup.object().shape({
    productName: yup.string().min(2, 'Nimen tulee olla vähintään 2 kirjainta pitkä').required('Tuotteen nimi vaaditaan'),
  })
  const initialValues = {
    productName: ''
  }
  const handleSubmit = async (values) => {
    console.log(values.productName)
    const productName = values.productName
    const product =  { productName }
    productService.create(product)
      .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
        setNotification(`Tuote ${productName} lisätty!`, 'success')
      }).catch(e => {
        console.log(e)
        setNotification('Kirjaudu sisään lisätäksesi tuotteita', 'error')
      })
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProductSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const { errors, touched, isValid, dirty } = formik
        return (
          <div className="container">
            <Form  >
              <div className="form-row">
                <label htmlFor="productName">Tuotteen nimi: </label>
                <Field
                  type="text"
                  name="productName"
                  id="nameInput"
                  className={errors.productName && touched.productName ?
                    'input-error' : null}
                />
                <ErrorMessage name="productName" component="span" className="error" />
              </div>
              <button
                id='addproductBtn'
                type="submit"
                className={!(dirty && isValid) ? 'disabled-btn' : ''}
                disabled={!(dirty && isValid)}
              >
              Lisää tuote
              </button>
            </Form>
            <Notification />
          </div>
        )
      }}
    </Formik>
  )
}
export default ProductForm
