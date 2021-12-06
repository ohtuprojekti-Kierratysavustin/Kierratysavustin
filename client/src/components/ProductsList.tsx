import React from 'react'
import {
  Link
} from 'react-router-dom'
import FavoritesForm from './forms/FavoritesForm'
import logo from '../media/logo.png'
import { Container, Media, ListGroup, Row, Col } from 'react-bootstrap'
import { Product } from '../types/objects'
import ProductUserCountForm from './forms/ProductUserCountForm'
import { PRODUCT_USER_COUNT_REQUEST_TYPE, counterService } from '../services/counters'
import DeleteProduct from './forms/DeleteProduct'
import { useStore } from '../store'

type Props = {
  userProducts: Product[],
  header: String
}

const ProductsList: React.FC<Props> = ({ userProducts, header }) => {
  const { user } = useStore()
  return (
    <div>
      <Container>
        <h2>{header}</h2>
        <ListGroup as='ul' id='list'>
          {userProducts.map(product =>
            <ListGroup.Item action as='li' key={product.id} id='list-item'>
              <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`}>

                <Media>
                  <img
                    className="product-image-list-view"
                    src={product.productImage ? `${process.env.PUBLIC_URL}/api/files/images/${product.productImage}` : logo}
                    alt=""
                  />
                  {/* Toinen tapa kuvan croppaamiseen keskitetysti tietyyn kokoon */}
                  {/* <div
                    style={{
                      width: '200px',
                      height: '200px',
                      backgroundImage: 'url(' + (product.productImage ? `/api/files/images/${product.productImage}` : logo) + ')',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover'
                    }}
                  /> */}
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
                            {user !== null ? (
                              <div className='ListItemButtons'>
                                <Col>
                                  <FavoritesForm product={product} />
                                </Col>
                                <Col>
                                  <DeleteProduct product={product} />
                                </Col>
                              </div>
                            ) : (
                              ''
                            )}
                          </Row>
                        </Col>
                        {user !== null ?
                          <>
                            <Col sm={2}>
                              <ProductUserCountForm
                                product={product}
                                countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
                                amountText={'Hankittu'}
                                sendUpdateText={'Hanki'}
                                subtractUpdateText={'Vähennä'}
                                tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
                                tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
                                counterService={counterService}
                                statisticsService={undefined}
                                setChartData={undefined}
                              />
                            </Col>
                            <Col sm={2}>
                              <ProductUserCountForm
                                product={product}
                                countType={PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE}
                                amountText={'Kierrätetty'}
                                sendUpdateText={'Kierrätä'}
                                subtractUpdateText={'Vähennä'}
                                tooltipAdd={'Kasvata tuotteen kierrätystilastoa.'}
                                tooltipDelete={'Vähennä tuotteen kierrätystilastoa.'}
                                counterService={counterService}
                                statisticsService={undefined}
                                setChartData={undefined}
                              />
                            </Col>
                          </>
                          : ''}
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

export default ProductsList