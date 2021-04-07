import React from 'react'
import {
  Link
} from 'react-router-dom'

import { Media, ListGroup } from 'react-bootstrap'

const FavouriteProducts = ({ userProducts }) => {
  console.log(userProducts)

  return (
    <div>
      <h2>Suosikki tuotteet</h2>
      <ListGroup as='ul'>
        {userProducts.map(product =>
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
    </div>
  )
}

export default FavouriteProducts