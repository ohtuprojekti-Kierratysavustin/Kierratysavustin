import React, { useEffect } from 'react'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import { useStore } from '../App'

import { Container, Row, Modal, Button } from 'react-bootstrap'

/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const { user, clearNotification } = useStore()
  const [modalShow, setModalShow] = React.useState(false)

  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null


  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InstructionForm product = {product}/>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div>

      {user !== null ? (

        <Container>
          <Row>
            <FavoritesForm product = {product}/>
            <h2>{product.name}</h2>




            <Button variant="primary" onClick={() => setModalShow(true)}>
                Lisää uusi ohje
            </Button>

            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

          </Row>
          <Row>




            {product.instructions[0].information}

            {product.instructions.map(info =>
              <li id ="productInstruction" key={info.id}>{info.information}</li>
            )}
          </Row>
        </Container>

      ) : (
        <Container>
          <Row>
            <h2>{product.name}</h2>

            {product.instructions.map(info =>
              <li id ="productInstruction" key={info.id}>{info.information}</li>

            )}
          </Row>
        </Container>
      )}


    </div>
  )
}

export default Product