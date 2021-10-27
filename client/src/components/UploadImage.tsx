import React from 'react'
import { Button } from 'react-bootstrap'
import productService from '../services/products'
import { useStore } from '../store'

import { Product } from '../types/objects'

type Props = {
  product: Product
}

const UploadImage: React.FC<Props> = ({ product }) => {
  const productCreatorId = product.user
  const { user, setNotification/*, products, setProducts */ } = useStore()
  //const history = useHistory()

  if (!user || !productCreatorId) {
    return (null)
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    if (window.confirm(`Lisää kuva tuotteelle ${product.name}?`)) {
      await productService.addImage(product.id)
        .then((response) => {
          //setProducts(products.filter(p => p.id !== product.id))
          //history.push('/products')
          setNotification(response.message, 'success')
        })
        .catch((error) => {
          setNotification((error.message ? error.message : 'Kuvan lisäämisessä tapahtui odottamaton virhe!')
            , 'error')
        })
    }
  }

  if (user.id === productCreatorId) {
    return (
      <div>
        <input type="file" />
        <Button variant={'outline-success'} id="uploadImage" onClick={handleClick}>
          Lisää kuva
        </Button>
      </div>
    )
  }
  return (null)
}

export default UploadImage