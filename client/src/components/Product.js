import React, { useEffect, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import VoteForm from './VoteForm'
import { useStore  } from '../App'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Jumbotron, ListGroup, Button, Form } from 'react-bootstrap'
import '../styles.css'


/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const history = useHistory()
  const { user, clearNotification } = useStore()


  const [currentInstruction, setCurrentInstruction] = useState(0)
  const handleInstructionClick = (id) => {
    setCurrentInstruction(id)
  }
  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null



  return (
    <div>
      <Jumbotron>
        <Container>
          <Row><Col><Button onClick={() => history.goBack()}>takaisin</Button></Col></Row>
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
        <ListGroup id='instruction-list' as='ul' className='ul-style'>
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

export default Product