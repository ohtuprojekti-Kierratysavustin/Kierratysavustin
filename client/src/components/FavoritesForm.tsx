import React,{ useState,useEffect } from 'react'
import userService from '../services/user'
import { useStore } from '../store'
import { Button } from 'react-bootstrap'
import { Product } from '../types'

type Props = {
  product: Product
}

const FavoritesForm: React.FC<Props> = ({ product }) => {
  const { favorites, setFavorites, setNotification } = useStore()
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
        .then(response => setFavorites(favorites.filter(p => p.id !== response.resource.id)))
        .catch((error) => {
          setNotification((error.response.data.message ? error.response.data.message : 'Poistettaessa tuotetta suosikeista tapahtui odottamaton virhe!'), 'error')
        })
      setFavorite(false)
    } else {
      userService.addFavorite(product)
        .then(response => setFavorites(favorites.concat(response.resource)))
        .catch((error) => {
          setNotification((error.response.data.message ? error.response.data.message : 'Lisättäessä tuotetta suosikkeihin tapahtui odottamaton virhe!'), 'error')
        })
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