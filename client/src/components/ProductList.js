import React from 'react'
import { useStore } from '../App'
import {
  Link
} from 'react-router-dom'

import logo from '../media/logo.png'
import { Media, ListGroup, Container, Row, Col } from 'react-bootstrap'

import SearchBarForm from './SearchBarForm'
import InfoBar from './InfoBar'
import FavoritesForm from './FavoritesForm'
import '../styles.css'

/** Component for showing list of products and a link to product page */
const ProductList = ({ products }) => {
  const { user } = useStore()
  if (products.length === 0) {
    return (
      <div>
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Miten kierrätysavustin toimii'} />
        <SearchBarForm  />
        <Container>
          <Row>
            <Col>
              <h2>Haulla ei löytynyt yhtään tuotetta!</h2>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else {
    return (
      <div>
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Miten kierrätysavustin toimii'} />
        <SearchBarForm />
        <Container>
          <h2>Tuotteet</h2>
          <ListGroup as='ul' id='list'>
            {products.map(product =>
              <ListGroup.Item as='li' key={product.id} id='list-item' >
                <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`} state={{
                  product:product,
                }}>
                  <Media>
                    <img
                      width={64}
                      height={64}
                      className="mr-3"
                      src={logo}
                      alt=""
                    />
                    <Media.Body>
                      <Container>
                        <Row>
                          <Col>
                            <h5>{product.name}</h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col>

                            {product.instructions.length !== 0 ? (
                              <p>
                                {product.instructions[0].information.slice(0,50)}
                              </p>
                            ) : (
                              ''
                            )}
                            {user !== null ? (
                              <FavoritesForm product={product} />
                            ) : (
                              ''
                            )}

                          </Col>
                        </Row>
                      </Container>
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
}

export default ProductList