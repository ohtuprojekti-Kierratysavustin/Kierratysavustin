import React, { useEffect, useState } from 'react'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import { useStore  } from '../App'


import { Container, Row, Col, Jumbotron, ListGroup, Media, Modal, Button, Form } from 'react-bootstrap'

const ulStyle = {
  maxHeight:'300px',
  overflowY:'scroll',
  webkitOverflowScrolling:'touch',
  border:'solid 1px'
}
/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const { user, clearNotification } = useStore()
  const [modalShow, setModalShow] = useState(false)
  // const [showInstruction, setShowInstruction] = (product.instructions[0])
  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null
  const InstructionPopup = (props) =>  {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Uusi ohje tuotteelle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InstructionForm product = {product}/>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <div>
      <Jumbotron>
        <Container>
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
                <p>
                  {product.instructions[0].information}
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
            <Button
              id='instructionButton'
              variant="primary"
              onClick={() => setModalShow(true)}
            >
                    Lisää uusi ohje
            </Button>
          ) : (
            ''
          )}
          <InstructionPopup
            show={modalShow}
            onHide={() => setModalShow(false)}
          />

        </Form.Group>
        <ListGroup as='ul' style={ulStyle}>
          {product.instructions.map(instruct =>
            <ListGroup.Item as='li' key={instruct.id}>
              <Media>
                <Media.Body>
                  <h5>{instruct.name}</h5>

                  {instruct.information !== null ? (
                    <Container>
                      <Row>
                        <Col>
                          <p>
                            {instruct.information}
                          </p>
                        </Col>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Col md lg="1">
                          <Button>Like</Button>
                        </Col>
                        <Col md ="auto"><p>pisteet</p></Col>
                        <Col xs lg="0">
                          <Button>Dislike</Button>
                        </Col>
                      </Row>
                    </Container>
                  ) : (
                    ''
                  )}
                </Media.Body>
              </Media>

            </ListGroup.Item>
          )}
        </ListGroup>
      </Container>


    </div>
  )
}

export default Product