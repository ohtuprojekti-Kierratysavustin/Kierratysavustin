import React,{ useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'

const FavoritesForm = ( { user, product }) => {
  const { updateProduct } = useStore()
  const [favorite,setFavorite] = useState(product.users.indexOf(user.id) > -1)
  const label = favorite
    ? 'Poista suosikeista' : 'Lisää suosikkeihin'

  const handleClick = (event) => {
    event.preventDefault()
    if(favorite === true){
      productService.removeFavorite(product).then(i => {
        product.users = i.data.users
        updateProduct(product)
      })
      setFavorite(false)

    } else {
      productService.addFavorite(product).then(i => {
        product.users = i.data.users
        updateProduct(product)
      })
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