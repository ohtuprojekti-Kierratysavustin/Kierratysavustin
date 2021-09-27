import React from 'react'
import {
  Link
} from 'react-router-dom'
import FavoritesForm from './FavoritesForm'
import logo from '../media/logo.png'
import { Container, Media, ListGroup } from 'react-bootstrap'
import { Product } from '../types'
import RecycleForm from './RecycleForm'

type Props = {
  userProducts: Product[]
}

const FavouriteProducts: React.FC<Props> = ({ userProducts }) => {
  return (
    <div>
      <Container>
        <h2>Suosikki tuotteet</h2>
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
                    <h5>{product.name}</h5>


                    {product.instructions.length !== 0 ? (

                      <p>
                        {product.instructions[0].information.slice(0,50)}
                      </p>

                    ) : (
                      ''
                    )}
                    <div className='ListItemButtons'>
                      <FavoritesForm product={product} />
                      <RecycleForm product={product} />
                    </div>
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