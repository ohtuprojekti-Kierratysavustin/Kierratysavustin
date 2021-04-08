import React, { useState } from 'react'
import productService from '../services/products'
import Notification from './Notification'
import { useStore } from '../App'

import {  Form, Button, Container, } from 'react-bootstrap'

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
        <Container>
          <Notification />
          <Form.Group>
            <Form.Label>kierrätysohje</Form.Label>
            <Form.Control as="textarea"
              id="instructionInput"
              type='text'
              value={information}
              onChange={({ target }) => setInformation(target.value)}
              rows={5}
              cols={100}
            >
            </Form.Control>
            <Button id="addInstruction" type='submit'>lisää</Button>
          </Form.Group>
        </Container>
      </Form>
    </div>
  )
}
export default InstructionForm
