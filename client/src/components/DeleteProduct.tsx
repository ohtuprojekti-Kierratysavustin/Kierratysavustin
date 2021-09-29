import React from 'react'
import { Button } from 'react-bootstrap'
import productService from '../services/products'
import { useStore  } from '../store'
import { useHistory } from 'react-router-dom'
import { Product } from '../types'

type Props = {
    product: Product
}

const DeleteProduct: React.FC<Props> = ({ product }) => {
  const productCreatorId = product.user
  const { user, setNotification, products, setProducts } = useStore()
  const history = useHistory()

  if (!user || !productCreatorId) {
    return (null)
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    if (window.confirm(`Poista tuote ${product.name}`)) {
      try {
        await productService.remove(product.id)
        setProducts(products.filter(p => p.id !== product.id))
        history.push('/products')
        setNotification(`Tuote ${product.name} poistettu onnistuneesti`, 'success')
      } catch(error) {
        setNotification('Tuotteen poistaminen ei onnistunut', 'error')
      }
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