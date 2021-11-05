import React, { useEffect, useState } from 'react'
import productService from '../../services/products'
import fileService from '../../services/files'
import { useStore } from '../../store'
import InfoBar from '../InfoBar'
import FileInput from '../FileInput'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Form as Formo, Button, Container } from 'react-bootstrap'
import { ErrorResponse } from '../../types/requestResponses'

type ProductFormValues = {
  productName: string
}

const ProductForm = () => {
  const history = useHistory()
  const { products, setProducts, setNotification, clearNotification } = useStore()
  const [selectedFile, setSelectedFile] = useState<File | undefined>()

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
    if (!selectedFile || selectedFile.size <= 1000000) {
      productService.create(product)
        .then(response => {
          let newProduct = response.resource
          setProducts(products.concat(newProduct))
          if (selectedFile) {
            const formData = new FormData()
            formData.append('image', selectedFile)
            fileService.addProductImage(newProduct.id, formData)
              .then((response) => {
                productService.getAll().then(p => setProducts(p))
                history.push(`products/${newProduct.id}`)
                setNotification(`Tuote ${productName} lisätty ja ${response.message}`, 'success')
              })
              .catch((error: ErrorResponse) => {
                setNotification((error.message ? error.message : 'Kuvan lisäämisessä tapahtui odottamaton virhe!')
                  , 'error')
              })
          }
          else {
            history.push(`products/${newProduct.id}`)
          }
          setNotification(`Tuote ${productName} lisätty!`, 'success')
        }).catch((error) => {
          setNotification((error.message ? error.message : 'Tapahtui odottamaton virhe lisätessä uutta tuotetta!'), 'error')
        })
    }
    else {
      setNotification('Tarkista tiedostokoko. Maksimikoko on 1 Mt.', 'error')
    }
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
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
                  <FileInput selectedFile={selectedFile} handleInputChange={handleInputChange}/>
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
