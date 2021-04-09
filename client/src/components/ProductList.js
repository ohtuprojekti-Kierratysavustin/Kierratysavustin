import React from 'react'
import {
  Link
} from 'react-router-dom'

import { Media, ListGroup, Container } from 'react-bootstrap'

import InfoBar from './InfoBar'

/** Component for showing list of products and a link to product page */
const ProductList = ({ products }) => {
  if (products.length === 0) {
    return (
      <div>
        <h2>Haulla ei löytynyt yhtään tuotetta!</h2>
      </div>
    )
  } else {
    return (
      <div>


        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Miten kierrätysavustin toimii'} />

        <Container>
          <h2>Tuotteet</h2>
          <ListGroup as='ul'>
            {products.map(product =>
              <ListGroup.Item as='li' key={product.id}>
                <Link to={`/products/${product.id}`}>
                  <Media>
                    <img
                      width={64}
                      height={64}
                      className="mr-3"
                      src="holder.js/64x64"
                      alt=""
                    />
                    <Media.Body>
                      <h5>{product.name}</h5>

                      {product.instructions.length !== 0 ? (
                        <p>
                          {product.instructions[0].information}
                        </p>
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

}


export default ProductList