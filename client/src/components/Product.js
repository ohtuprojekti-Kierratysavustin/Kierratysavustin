import React, { useEffect, useState } from 'react'
import {
  Link
} from 'react-router-dom'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
//import ProductInstruction from './ProductInstruction'
import { useStore  } from '../App'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Jumbotron, ListGroup, Media, Modal, Button, Form } from 'react-bootstrap'
//import ProductInstruction from './ProductInstruction'

const ulStyle = {
  maxHeight:'300px',
  overflowY:'scroll',
  webkitOverflowScrolling:'touch',
  border:'solid 1px'
}
/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const history = useHistory()
  const { user, clearNotification } = useStore()
  //const tuote = setProduct(product)
  //console.log('prod', tuote)
  const [modalShow, setModalShow] = useState(false)
  // eslint-disable-next-line no-unused-vars
  //const [ohje,setOhje] = useState(product)
  //console.log('L=L', products)
  const handleClose = () => setModalShow(false)
  const handleShow = () => setModalShow(true)
  // const [showInstruction, setShowInstruction] = (product.instructions[0])
  useEffect(() => {
    clearNotification()
  }, [])
  console.log('tuote',product)

  if (!product) return null
  // eslint-disable-next-line no-unused-vars
  //const [productInstruction, setProductInstruction] = useState(product.instructions[0].information)
  //console.log('mv', productInstruction)

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
          <InstructionForm product = {product} handleClose={handleClose}/>
        </Modal.Body>
      </Modal>
    )
  }
  /*
  const changeInstruction = value => {

    setProductInstruction(value)
  }
*/
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
                <p>
                  p
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
              onClick={() => handleShow(true)}
            >
                    Lisää uusi ohje
            </Button>
          ) : (
            ''
          )}
          <InstructionPopup
            show={modalShow}
            onHide={() => handleClose(false)}
          />

        </Form.Group>
        <ListGroup as='ul' style={ulStyle}>
          {product.instructions.map(instruct =>
            <ListGroup.Item action as='li' key={instruct.id}>
              <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`} state={{
                product:product,
              }}>
                <Media>
                  <Media.Body>

                    {instruct.information !== null ? (
                      <Container>
                        <Row>
                          <Col>
                            <p>
                              {instruct.information.slice(0, 250)}
                            </p>
                          </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                          <Col md lg="1">
                            <Button variant='success'>Like</Button>
                          </Col>
                          <Col md ="auto"><p>pisteet</p></Col>
                          <Col xs lg="0">
                            <Button variant='danger'>Dislike</Button>
                          </Col>
                        </Row>
                      </Container>
                    ) : (
                      ''
                    )}
                  </Media.Body>
                </Media>
              </Link>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Container>


    </div>
  )
}

export default Product