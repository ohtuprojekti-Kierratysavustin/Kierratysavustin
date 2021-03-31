import React from 'react'
import productService from '../services/products'

const FavoritesForm = ( { product }) => {
  // const [favorite,setFavorite] = useState(false)

  // const label = favorite
  //   ? 'Poista suosikeista' : 'Lisää suosikkeihin'

  const handleClick = (event) => {
    event.preventDefault()

    productService.addFavorite(product)
    // favorite ? setFavorite(false) : setFavorite(true)
  }

  return (
    <div>
      <button id="addToFavorites" onClick={handleClick}>
        {/* {label} */}
        Lisää suosikkeihin
      </button>
    </div>
  )
}
export default FavoritesForm