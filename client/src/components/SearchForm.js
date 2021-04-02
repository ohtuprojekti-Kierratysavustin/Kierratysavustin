
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import FavouriteProducts from './FavouriteProducts'
import { useStore } from '../App'
//import { useStore } from '../App'
const SearchForm = ({ products, setFilteredProducts }) => {
  if (!products) {
    return null
  }
  const { user } = useStore()
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
      <form onSubmit={handleSubmit}>
        <label>
          Hakusana:
          <input
            id="searchInput"
            type='text'
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
          />
        </label>
        <button id="searchBtn" type='submit'>Hae</button>
        {user !== null ? (
          <FavouriteProducts userProducts={products}/>
        /* vaihda products */
        ) : (
          ''
        )}

      </form>
    </div>
  )
}
export default SearchForm