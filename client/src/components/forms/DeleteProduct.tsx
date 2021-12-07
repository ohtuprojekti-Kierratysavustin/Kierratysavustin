import React from 'react'
import { Button } from 'react-bootstrap'
import productService from '../../services/products'
import { useStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import { Product } from '../../types/objects'
import { ErrorResponse } from '../../types/requestResponses'

type Props = {
  product: Product
}

const DeleteProduct: React.FC<Props> = ({ product }) => {
  const productCreatorId = product.creator
  const { user, setNotification, products, setProducts } = useStore()
  const navigate = useNavigate()

  if (!user || !productCreatorId) {
    return (null)
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    if (window.confirm(`Poista tuote ${product.name}`)) {
      await productService.remove(product.id)
        .then((response) => {
          setProducts(products.filter(p => p.id !== product.id))
          navigate('/products')
          setNotification(response.message, 'success')
        })
        .catch((error: ErrorResponse) => {
          setNotification((error.message ? error.message : 'Tuotetta poistettaessa tapahtui odottamaton virhe!')
            , 'error')
        })
    }
  }

  if (user.id === productCreatorId) {
    return (
      <div>
        <Button variant={'outline-danger'} id="deleteItem" onClick={handleClick}>
          Poista tuote
        </Button>
      </div>
    )
  }
  return (null)
}

export default DeleteProduct