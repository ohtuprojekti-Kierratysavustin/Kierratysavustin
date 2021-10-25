import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SearchBarForm from '../forms/SearchBarForm'
import InfoBar from '../InfoBar'
import '../../styles.css'
import { Product } from '../../types/objects'
import ProductsList from '../ProductsList'


type Props = {
  products: Product[],
  setFilteredProducts: (filteredProducts: Product[]) => void
}

/** Component for showing list of products and a link to product page */
const ProductListView: React.FC<Props> = ({ products, setFilteredProducts }) => {
  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Hae tai selaa kierrätysavustimeen jo lisättyjä tuotteita.'} />
      <SearchBarForm products={products} setFilteredProducts={setFilteredProducts} />
      {products.length === 0
        ?
        <Container>
          <Row>
            <Col>
              <h2>Haulla ei löytynyt yhtään tuotetta!</h2>
            </Col>
          </Row>
        </Container>
        :
        <ProductsList userProducts={products} header='Tuotteet'></ProductsList>
      }

    </div>
  )
}

export default ProductListView