import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SearchBarForm from '../forms/SearchBarForm'
import InfoBar from '../InfoBar'
import '../../styles.css'
import { Product } from '../../types/objects'
import ProductsList from '../ProductsList'

type Props = {
  products: Product[],
  filteredProducts: Product[] | undefined,
  setFilteredProducts: (filteredProducts: Product[]) => void
}

/** Component for showing list of products and a link to product page */
const ProductListView: React.FC<Props> = ({ products, setFilteredProducts, filteredProducts }) => {
  return (
    <div id='product-list-view'>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Hae tai selaa kierrätysavustimeen jo lisättyjä tuotteita.'} />
      <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />
      {!filteredProducts
        ?
        <ProductsList products={products} header='Tuotteet'></ProductsList>
        : filteredProducts.length === 0
          ?
          <Container>
            <Row>
              <Col>
                <h2>Haulla ei löytynyt yhtään tuotetta!</h2>
              </Col>
            </Row>
          </Container>
          : <ProductsList products={filteredProducts} header='Hakusanalla löytyneet tuotteet'></ProductsList>
      }
    </div>
  )
}

export default ProductListView