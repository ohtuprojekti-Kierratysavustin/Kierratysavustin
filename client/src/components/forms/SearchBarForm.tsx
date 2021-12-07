import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, InputGroup, Container, Col, Row } from 'react-bootstrap'
import { Product } from '../../types/objects'

type Props = {
  products: Product[],
  setFilteredProducts: (filteredProducts: Product[]) => void
}

const SearchBarForm = ({ products, setFilteredProducts }: Props) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  if (!products) {
    return null
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
    setSearchTerm('')
    navigate('/searchResults')
  }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit} id='searchForm'>
              <InputGroup className="mb-1">
                <Button id="searchBtn" type='submit' size='lg' variant='outline-dark'>Etsi</Button>
                <Form.Control
                  placeholder='Kirjoita hakusana...'
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