import React, { useEffect, useState } from 'react'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import { useStore  } from '../App'

import { Container, Row, Col, Jumbotron, ListGroup, Media, Modal, Button } from 'react-bootstrap'

/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const { user, clearNotification } = useStore()
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null

  function InstructionPopup(props) {
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
      <Container>
        <Jumbotron>
          <Row>
            <Col>
              {user !== null ? (
                <FavoritesForm product = {product}/>
              ) : (
                ''
              )}
            </Col>
            <Col>
              <h2>{product.name}</h2>
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
        </Jumbotron>
        <Row>
          <Col>
            {user !== null ? (
              <Button variant="primary" onClick={() => setModalShow(true)}>
                    Lisää uusi ohje
              </Button>
            ) : (
              ''
            )}
            <InstructionPopup
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </Col>
          <Row>
            <ListGroup as='ul'>
              {product.instructions.map(instruct =>
                <ListGroup.Item as='li' key={instruct.id}>
                  <Media>
                    <img
                      width={64}
                      height={64}
                      className="mr-3"
                      src="holder.js/64x64"
                      alt=""
                    />
                    <Media.Body>
                      <h5>{instruct.name}</h5>

                      {instruct.information !== null ? (
                        <p>
                          {instruct.information}
                        </p>
                      ) : (
                        ''
                      )}

                    </Media.Body>
                  </Media>

                </ListGroup.Item>
              )}
            </ListGroup>
          </Row>
        </Row>
      </Container>


    </div>
  )
}

export default Product