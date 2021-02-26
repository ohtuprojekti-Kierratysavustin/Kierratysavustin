
import React, { useState } from 'react'
//import productService from '../services/products'

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(searchTerm)
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
    </div>
  )
}
export default SearchForm