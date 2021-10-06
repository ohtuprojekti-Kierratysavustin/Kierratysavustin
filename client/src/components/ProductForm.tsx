import React, { useEffect } from 'react'
import productService from '../services/products'
import { useStore } from '../store'
import InfoBar from './InfoBar'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Form as Formo, Button, Container } from 'react-bootstrap'

type ProductFormValues = {
  productName: string
}

const ProductForm = () => {
  const history = useHistory()
  const { products, setProducts, setNotification, clearNotification } = useStore()

  useEffect(() => {
    clearNotification()
  }, [])
  const ProductSchema = yup.object().shape({
    productName: yup.string().min(2, 'Nimen tulee olla vähintään 2 kirjainta pitkä').required('Tuotteen nimi vaaditaan'),
  })
  const initialValues = {
    productName: ''
  }
  const handleSubmit = async (values: ProductFormValues) => {
    const productName = values.productName
    const product = { name: productName }
    productService.create(product)
      .then(response => {
        let newProduct = response.resource
        setProducts(products.concat(newProduct))
        history.push(`products/${newProduct.id}`)
        setNotification(`Tuote ${productName} lisätty!`, 'success')
      }).catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe lisätessä uutta tuotetta!'), 'error')
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
            <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Puuttuuko kierrätysavustimesta jokin tuote? Ei hätää! Voit lisätä sen alla olevalla lomakkeella järjestelmään.'} />
            <Container>
              <Formo as={Form}  >
                <Formo.Group>
                  <Formo.Label htmlFor="productName">Tuotteen nimi: </Formo.Label >
                  <Formo.Control as={Field}
                    type="text"
                    name="productName"
                    id="nameInput"
                    className={errors.productName && touched.productName ?
                      'input-error' : undefined}
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
