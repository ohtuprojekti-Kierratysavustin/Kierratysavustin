import React, { useState } from 'react'
import favoriteService from '../services/favorites'
// const pro = [
//   { id: 1,
//     name: 'test'
//   }
// ]
const FavoritesForm = ( user,product) => {
  const favorite = useState(favoriteService.getFavorites(user).some(p => p === product))

  // useState(pro.some(p => p.name === 'test'))
  const label = favorite
    ? 'Poista suosikeista' : 'Lisää suosikkeihin'

  const handleClick = (event) => {
    event.preventDefault()
    favorite ? favoriteService.removeFavorite(user,product): favoriteService.addFavorite(user,product)
    // favorite ? setFavorite(false) : setFavorite(true)
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