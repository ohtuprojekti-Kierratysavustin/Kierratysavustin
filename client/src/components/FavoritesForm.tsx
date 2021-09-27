import React,{ useState,useEffect } from 'react'
import userService from '../services/user'
import { useStore } from '../store'
import { Button } from 'react-bootstrap'
import { Product } from '../types'

type Props = {
  product: Product
}

const FavoritesForm: React.FC<Props> = ({ product }) => {
  const { favorites, setFavorites } = useStore()
  const [favorite, setFavorite] = useState(favorites.some(p => p.id === product.id))
  useEffect(() => { setFavorite(favorites.some(p => p.id === product.id))})
  const buttonStyle = favorite
    ? 'outline-danger' : 'outline-success'
  const label = favorite
    ? 'Poista suosikeista' : 'Lisää suosikkeihin'
  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault()
    if(favorite === true){
      userService.removeFavorite(product)
        .then(product => setFavorites(favorites.filter(p => p.id !== product.id))).catch((error) => {console.log(error)})
      setFavorite(false)
    } else {
      userService.addFavorite(product)
        .then(p => setFavorites(favorites.concat(p))).catch((error) => {console.log(error)})
      setFavorite(true)
    }
  }
  return (
    <div>
      <Button variant={buttonStyle} id="addToFavorites" onClick={handleClick}>
        {label}
      </Button>
    </div>
  )
}
export default FavoritesForm