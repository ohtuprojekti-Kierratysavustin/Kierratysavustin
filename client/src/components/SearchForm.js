
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import FavouriteProducts from './FavouriteProducts'
import { useStore } from '../App'
//import { useStore } from '../App'

import { Form, Button, InputGroup, Container, Col, Row } from 'react-bootstrap'
import InfoBar from './InfoBar'

const SearchForm = ({ products, setFilteredProducts }) => {
  if (!products) {
    return null
  }
  const { user, favorites } = useStore()
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')
  //const { products,setFilteredProducts } = useStore()
  const handleSubmit = (event) => {
    event.preventDefault()
    setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
    setSearchTerm('')
    history.push('/searchResults')
  }

  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'kierrätysavustimesta lyhyesti'} />


      <Container>
        <Row>
          <Col>
            <Form inline onSubmit={handleSubmit}>
              <InputGroup className="mb-1">
                <InputGroup.Prepend>
                  <Button id="searchBtn" type='submit' size='lg' variant='outline-dark'>Etsi</Button>
                </InputGroup.Prepend>
                <Form.Control
                  placeholder='Hae'
                  size='lg'
                  id="searchInput"
                  type='text'
                  value={searchTerm}
                  onChange={({ target }) => setSearchTerm(target.value)}
                />
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>





      {user !== null ? (
        <FavouriteProducts userProducts={favorites}/>
        /* vaihda products */
      ) : (
        ''
      )}
    </div>
  )
}
export default SearchForm