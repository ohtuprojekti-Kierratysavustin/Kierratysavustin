import React, { useEffect } from 'react'
import productService from '../services/products'
import { useStore } from '../App'
import InfoBar from './InfoBar'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { Formik, Form , Field, ErrorMessage  } from 'formik'

import { Form as Formo, Button, Container } from 'react-bootstrap'

const ProductForm = () => {
  const history = useHistory()
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
    const productName = values.productName
    const product =  { name: productName }
    productService.create(product)
      .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
        history.push(`products/${returnedProduct.id}`)
        setNotification(`Tuote ${productName} lisätty!`, 'success')
      }).catch(e => {
        console.log(e)
        setNotification('Et voi lisätä tyhjää tuotetta', 'error')
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
          <div>
            <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Täällä voit lisätä tuotteen palveluun'} />
            <Container>
              <Formo as={Form}  >
                <Formo.Group>
                  <Formo.Label htmlFor="productName">Tuotteen nimi: </Formo.Label >
                  <Formo.Control as={Field}
                    type="text"
                    name="productName"
                    id="nameInput"
                    className={errors.productName && touched.productName ?
                      'input-error' : null}
                  />
                  <ErrorMessage name="productName" component="span" className="error" />
                </Formo.Group>
                <Button
                  id='addproductBtn'
                  type="submit"
                  className={!(dirty && isValid) ? 'disabled-btn' : ''}
                  disabled={!(dirty && isValid)}
                >
              Lisää tuote
                </Button>
              </Formo>
            </Container>
          </div>
        )
      }}
    </Formik>
  )
}
export default ProductForm
