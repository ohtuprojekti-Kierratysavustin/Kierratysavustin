import React, { useEffect, useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'
import { Form,Button,Container } from 'react-bootstrap'
import InfoBar from './InfoBar'
const ProductForm = () => {
  const { products, setProducts, setNotification , clearNotification } = useStore()
  useEffect(() => {
    clearNotification()
  }, [])
  const [productName, setProductName] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const product = { productName }
    productService.create(product)
      .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
        setNotification(`Tuote ${productName} lisätty!`, 'success')
      }).catch(e => {
        console.log(e)
        setNotification('Et voi lisätä tyhjää tuotetta', 'error')
      })
    setProductName('')
  }

  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Täällä voit lisätä tuotteen palveluun'} />
      <Container>

        <Form onSubmit={handleSubmit}>
          <h1>Lisää tuote palveluun</h1>
          <Notification />
          <Form.Group>

            <Form.Label> Tuotteen nimi</Form.Label>
            <Form.Control id="nameInput"
              type='text'
              value={productName}
              onChange={({ target }) => setProductName(target.value)}
            />
          </Form.Group>
          <Button id="addproductBtn" type='submit'>lisää</Button>
        </Form>
      </Container>

    </div>
  )
}
export default ProductForm
