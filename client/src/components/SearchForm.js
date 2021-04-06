
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import FavouriteProducts from './FavouriteProducts'
import { useStore } from '../App'
//import { useStore } from '../App'

import { Form, Button, InputGroup } from 'react-bootstrap'

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