import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

import { InputGroup, FormControl, Form, Button, Container, Row, Col } from 'react-bootstrap'

const InstructionForm = ({ product }) => {
  const [information, setInformation] = useState('')
  const { updateProduct, setNotification } = useStore()
  const handleSubmit = (event) => {
    event.preventDefault()
    const instruction = { information }
    productService.createInstruction(product.id, instruction)
      .then(i => {
        product.instructions.push(i)
        updateProduct(product)
        setNotification('Ohje lisätty!', 'success')
      }).catch(e => {
        console.log(e)
        setNotification('Kirjaudu sisään lisätäksesi kierrätysohje', 'error')
      })
    setInformation('')
  }

  return (
    <div>
      <Form inline onSubmit={handleSubmit}>
        <Notification />
        <Container>
          <Row>
            <Col >
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Kierrätysohje</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="textarea"
                  id="instructionInput"
                  type='text'
                  value={information}
                  onChange={({ target }) => setInformation(target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button id="addInstruction" type='submit'>lisää</Button>
            </Col>
          </Row>
        </Container>

      </Form>
    </div>
  )
}
export default InstructionForm
