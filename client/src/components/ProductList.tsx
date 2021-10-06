import React from 'react'
import { useStore } from '../store'
import {
  Link
} from 'react-router-dom'
import logo from '../media/logo.png'
import { Media, ListGroup, Container, Row, Col } from 'react-bootstrap'
import SearchBarForm from './SearchBarForm'
import InfoBar from './InfoBar'
import FavoritesForm from './FavoritesForm'
import DeleteProduct from './DeleteProduct'
import '../styles.css'
import { Product } from '../types'
import ProductUserCountForm from './ProductUserCountForm'
import { REQUEST_TYPE as COUNT_REQUEST_TYPE } from '../services/productUserCount'


type Props = {
  products: Product[],
  setFilteredProducts: (filteredProducts: Product[]) => void
}

/** Component for showing list of products and a link to product page */
const ProductList: React.FC<Props> = ({ products, setFilteredProducts }) => {
  const { user } = useStore()
  if (products.length === 0) {
    return (
      <div>
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Hae tai selaa kierrätysavustimeen jo lisättyjä tuotteita.'} />
        <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />
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
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Hae tai selaa kierrätysavustimeen jo lisättyjä tuotteita.'} />
        <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />
        <Container>
          <h2>Tuotteet</h2>
          <ListGroup as='ul' id='list'>
            {products.map(product =>
              <ListGroup.Item as='li' key={product.id} id='list-item' >
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
                          <Col>
                            <h5>{product.name}</h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col>

                            {product.instructions.length !== 0 ? (
                              <p>
                                {product.instructions[0].information.slice(0, 50)}
                              </p>
                            ) : (
                              ''
                            )}
                            {user !== null ? (
                              <div className='ListItemButtons'>
                                <FavoritesForm product={product} />
                                <ProductUserCountForm product={product} countType={COUNT_REQUEST_TYPE.RECYCLE} amountText={'Kierrätetty'} sendUpdateText={'Kierrätä'} redoUpdateText={'Peru viimeisin kierrätys'}/>
                                <ProductUserCountForm product={product} countType={COUNT_REQUEST_TYPE.PURCHASE} amountText={'Hankittu'} sendUpdateText={'Hanki'} redoUpdateText={'Peru viimeisin hankinta'}/>
                              </div>
                            ) : (
                              ''
                            )}

                          </Col>
                          <Col>
                            <DeleteProduct product={product} />
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