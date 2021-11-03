import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import productService from '../services/products'
import fileService from '../services/files'
import { useStore } from '../store'

import { Product } from '../types/objects'

type Props = {
  product: Product
}

const UploadImage: React.FC<Props> = ({ product }) => {
  const productCreatorId = product.user
  const { user, setNotification, setProducts } = useStore()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  if (!user || !productCreatorId) {
    return (null)
  }

  const handleInputChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    if (selectedFile && window.confirm(`Lisää kuva ${selectedFile.name} tuotteelle ${product.name}?`)) {
      const formData = new FormData()
      formData.append('image', selectedFile)
      console.log(formData.get('image'))
      await fileService.addProductImage(product.id, formData)
        .then((response) => {
          productService.getAll().then(p => setProducts(p))
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
        <label htmlFor='imageSelect' className='btn btn-outline-dark btn-sm'>{(selectedFile ? 'Vaihda tiedostoa' : 'Valitse tiedosto')}</label>
        <p className=''>{(selectedFile ? selectedFile.name : 'Kuvaa ei valittu')}</p>
        <input id='imageSelect' type="file" name="file" style={{ display: 'none' }} accept='image/*' onChange={handleInputChange} />
        <div>
          <Button
            id='uploadImage'
            variant='success'
            size='sm'
            onClick={handleClick}
            disabled={selectedFile === undefined}
          >Lisää kuva
          </Button>
        </div>
      </div>
    )
  }
  return (null)
}

export default UploadImage