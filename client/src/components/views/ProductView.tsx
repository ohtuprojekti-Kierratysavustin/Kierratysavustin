import React, { useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import InstructionForm from '../forms/InstructionForm'
import FavoritesForm from '../forms/FavoritesForm'
import VoteForm from '../forms/VoteForm'
import DeleteInstructionForm from '../forms/DeleteInstructionForm'
import DeleteProduct from '../DeleteProduct'
import { useStore } from '../../store'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Jumbotron, ListGroup, Button, Form } from 'react-bootstrap'
import '../../styles.css'
import { Product } from '../../types/objects'
import ProductUserCountForm from '../forms/ProductUserCountForm'
import { productUserCountService, PRODUCT_USER_COUNT_REQUEST_TYPE } from '../../services/productUserCount'
import UploadImage from '../UploadImage'
import logo from '../../media/logo.png'

type Props = {
  product?: Product
}

/** Component for showing product name and recycling information. */
const ProductView: React.FC<Props> = ({ product }) => {
  const history = useHistory()
  const { user, clearNotification } = useStore()

  const routeChange = () => {
    history.goBack()
  }
  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null

  return (
    <div>
      <Jumbotron id='infobar'>
        <Container>
          <Row>
            <Col>
              <Button onClick={() => routeChange()} id='neutral-button' size='sm'>Takaisin</Button>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Row>
                <h2>{product.name}</h2>
              </Row>
              <Row>
                <Col>
                  <img
                    style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
                    className="mr-3"
                    src={product.productImage ? `/api/files/images/${product.productImage}` : logo}
                    alt={product.name}
                  />
                </Col>
                {user !== null ? (
                  <>
                    <Col>
                      <UploadImage product={product} />
                    </Col>
                    <Col>
                      <FavoritesForm product={product} />
                      <br></br>
                      <DeleteProduct product={product} />
                    </Col>
                  </>
                ) : (
                  ''
                )}
              </Row>
            </Col>
            {user !== null ? (
              <>
                <Col sm={2} className='product-user-count-form'>
                  <ProductUserCountForm
                    product={product}
                    countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
                    amountText={'Hankittu'}
                    sendUpdateText={'Hanki'}
                    subtractUpdateText={'Vähennä'}
                    tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
                    tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
                    productUserCountService={productUserCountService}
                  />
                </Col>
                <Col sm={2} className='product-user-count-form'>
                  <ProductUserCountForm
                    product={product}
                    countType={PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE}
                    amountText={'Kierrätetty'}
                    sendUpdateText={'Kierrätä'}
                    subtractUpdateText={'Vähennä'}
                    tooltipAdd={'Kasvata tuotteen kierrätystilastoa.'}
                    tooltipDelete={'Vähennä tuotteen kierrätystilastoa.'}
                    productUserCountService={productUserCountService}
                  />
                </Col>
              </>
            ) : (
              ''
            )}
          </Row>
        </Container>
      </Jumbotron>
      <Container>
        <Row>
          <Col sm={10}>
            <h3>
              Kierrätysohjeet
            </h3>
          </Col>
          <Col sm={2}>
            <Form.Group>
              {user !== null ? (
                <InstructionForm product={product} />
              ) : (
                ''
              )}
            </Form.Group>
          </Col>
        </Row>
        {product.instructions.length !== 0 ? (
          <ListGroup id='instruction-list' as='ul' >
            {product.instructions.map((instruct) =>
              <ListGroup.Item id='instruction-list-item' action as='li' key={instruct.id} >
                <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`}>
                  <Container id='vote-form'>
                    <Row >
                      <Col>
                        {instruct.information !== null ? (
                          <p>
                            {instruct.information.slice(0, 75)}
                          </p>
                        ) : (
                          ''
                        )}
                      </Col>
                      {user !== null ? (
                        <>
                          <DeleteInstructionForm product={product} instruction={instruct} />
                          <VoteForm instruction={instruct} user={user} product={product} />
                        </>
                      ) : (
                        ''
                      )}
                    </Row>

                  </Container>
                </Link>

              </ListGroup.Item>
            )}
          </ListGroup>
        ) : (
          <span>ei ohjeita</span>
        )}
      </Container>
    </div>
  )
}

export default ProductView