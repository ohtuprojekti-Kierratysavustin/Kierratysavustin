import React,{ useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'

const FavoritesForm = ( { product }) => {
  const { favorites, setFavorites } = useStore()
  const [favorite, setFavorite] = useState(favorites.some(p => p.id === product.id))
  const label = favorite
    ? 'Poista suosikeista' : 'Lisää suosikkeihin'

  const handleClick = (event) => {
    event.preventDefault()
    if(favorite === true){
      productService.removeFavorite(product)
        .then(setFavorites(favorites.filter(p => p.id !== product.id)))
      setFavorite(false)
    } else {
      productService.addFavorite(product).then(setFavorites(favorites.concat(product)))
      setFavorite(true)
    }
  }
  return (
    <div>
      <button id="addToFavorites" onClick={handleClick}>
        {label}
      </button>
    </div>
  )
}
export default FavoritesForm