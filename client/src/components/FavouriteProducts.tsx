import React from 'react'
import {
  Link
} from 'react-router-dom'
import FavoritesForm from './FavoritesForm'
import logo from '../media/logo.png'
import { Container, Media, ListGroup, Row, Col } from 'react-bootstrap'
import { Product } from '../types'
import ProductUserCountForm from './ProductUserCountForm'
import { REQUEST_TYPE as COUNT_REQUEST_TYPE } from '../services/productUserCount'

type Props = {
  userProducts: Product[]
}

const FavouriteProducts: React.FC<Props> = ({ userProducts }) => {
  return (
    <div>
      <Container>
        <h2>Suosikkituotteet</h2>
        <ListGroup as='ul' id='list'>
          {userProducts.map(product =>
            <ListGroup.Item action as='li' key={product.id} id='list-item'>
              <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`}>

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
                        <Col sm={8}>
                          <Row>
                            <h5>{product.name}</h5>
                          </Row>
                          <Row>
                            {product.instructions.length === 0 ? '' : product.instructions[0].information.length >= 50 ? (
                              <p>
                                Suositelluin ohje: {product.instructions[0].information.slice(0, 50)}...
                              </p>
                            ) : (
                              <p>
                                Suositelluin ohje: {product.instructions[0].information.slice(0, 50)}
                              </p>
                            )}
                          </Row>
                          <Row>
                            <Col>
                              <FavoritesForm product={product} />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={2}>
                          <ProductUserCountForm product={product} countType={COUNT_REQUEST_TYPE.PURCHASE} amountText={'Hankittu'} sendUpdateText={'Hanki'} redoUpdateText={'Poista'} tooltipAdd={'Lisää hankkimiasi tuotteita tietokantaan.'} tooltipDelete={'Poista hankkimiasi tuotteita tietokannasta.'}/>
                        </Col>
                        <Col sm={2}>
                          <ProductUserCountForm product={product} countType={COUNT_REQUEST_TYPE.RECYCLE} amountText={'Kierrätetty'} sendUpdateText={'Kierrätä'} redoUpdateText={'Poista'} tooltipAdd={'Lisää hankkimiasi tuotteita tietokantaan.'} tooltipDelete={'Poista hankkimiasi tuotteita tietokannasta.'}/>
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

export default FavouriteProducts