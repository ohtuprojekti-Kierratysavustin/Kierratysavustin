import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button, InputGroup, Container, Col, Row } from 'react-bootstrap'

const SearchBarForm = ( { products, setFilteredProducts }) => {
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')
  if (!products) {
    return null
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
    setSearchTerm('')
    history.push('/searchResults')
  }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Form inline onSubmit={handleSubmit} id='searchForm'>
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
    </div>
  )
}

export default SearchBarForm