import React, { useEffect, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import VoteForm from './VoteForm'
import ProductService from '../services/products'
import { useStore  } from '../store'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Jumbotron, ListGroup, Button, Form } from 'react-bootstrap'
import '../styles.css'
import { Product } from '../types'

type Props = {
  product?: Product
}

/** Component for showing product name and recycling information. */
const ProductPage: React.FC<Props> = ({ product }) => {
  const history = useHistory()
  const { user, clearNotification } = useStore()
  const [currentInstruction, setCurrentInstruction] = useState(0)

  const routeChange = () => {
    history.goBack()
  }
  const handleInstructionClick = (id: number) => {
    setCurrentInstruction(id)
  }
  useEffect(() => {
    clearNotification()
  }, [])

  const handleDelete = (productId, instructionId) => {
    ProductService.deleteInstruction(productId, instructionId)
    window.location.reload()
  }

  if (!product) return null

  return (
    <div>
      <Jumbotron id='infobar'>
        <Container>
          <Row>
            <Col>
              <Button onClick={() => routeChange()} id='neutral-button'>Takaisin</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <h2>{product.name}</h2>
            </Col>
            <Col sm={2}>
              {user !== null ? (
                <FavoritesForm product = {product}/>
              ) : (
                ''
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>
                Ohjeet kierrätykseen
              </h4>
            </Col>
          </Row>
          <Row>
            <Col>
              {product.instructions.length !== 0 ? (
                <p id='top-score'>
                  {product.instructions[currentInstruction].information}
                </p>
              ) : (
                <span>ei ohjeita</span>
              )}
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Container>
        <Form.Group>
          {user !== null ? (
            <InstructionForm product = {product} />
          ) : (
            ''
          )}
        </Form.Group>
        <ListGroup id='instruction-list' as='ul' >
          {product.instructions.map((instruct, index) =>
            <ListGroup.Item id='instruction-list-item' action as='li' key={instruct.id} >
              <Link style={{ textDecoration: 'none' }}  to={`/products/${product.id}`}>
                <Container id='vote-form'>
                  <Row >
                    <Col onClick={() => handleInstructionClick(index)}>
                      {instruct.information !== null ? (
                        <p>
                          {instruct.information.slice(0, 75)}
                        </p>
                      ) : (
                        ''
                      )}
                    </Col>
                    {user !== null ? (
                      <Button
                        id='deleteInstructionButton'
                        variant='outline-danger'
                        onClick={() => handleDelete(product.id, instruct.id)}
                      >
                        Poista
                      </Button>
                    ) : (
                      ''
                    )}
                    <VoteForm instruction = {instruct} user = {user} product={product} />
                  </Row>

                </Container>
              </Link>

            </ListGroup.Item>
          )}
        </ListGroup>
      </Container>
    </div>
  )
}

export default ProductPage