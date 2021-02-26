
import React, { useState } from 'react'
import ProductList from './ProductList'
const SearchForm = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [productsFound, setProductsFound]= useState(false)
  const [searchResults, setSearchResults]= useState([])
  const products = props.products

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(searchTerm)
    console.log(products)
    setSearchResults(products.filter(p => p.name === searchTerm))
    console.log(searchResults)
    setProductsFound(true)
    setSearchTerm('')
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Hakusana:
          <input
            type='text'
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
          />
        </label>
        <button type='submit'>Hae</button>
      </form>
      {productsFound ? (
        <ProductList products={searchResults} />
      ) : (
        ''
      )}
    </div>

  )

}
export default SearchForm