import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import productService from '../services/products'
import fileService from '../services/files'
import { useStore } from '../store'
import { Product } from '../types/objects'
import { ErrorResponse } from '../types/requestResponses'
import FileInput from './FileInput'

type Props = {
  product: Product
}

const UploadImage: React.FC<Props> = ({ product }) => {
  const productCreatorId = product ? product.user : undefined
  const { user, setNotification, setProducts } = useStore()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  if (!user || user.id !== productCreatorId) {
    return (null)
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault()
    if (selectedFile && window.confirm(`Lisää kuva ${selectedFile.name} tuotteelle ${product.name}?`)) {
      const formData = new FormData()
      formData.append('image', selectedFile)
      fileService.addProductImage(product.id, formData)
        .then((response) => {
          productService.getAll().then(p => setProducts(p))
          setNotification(response.message, 'success')
        })
        .catch((error: ErrorResponse) => {
          setNotification((error.message ? error.message : 'Kuvan lisäämisessä tapahtui odottamaton virhe!')
            , 'error')
        })
    }
  }

  return (
    <div>
      <FileInput selectedFile={selectedFile} handleInputChange={handleInputChange} />
      <Button
        id='uploadImage'
        variant='success'
        size='sm'
        onClick={handleClick}
        disabled={selectedFile === undefined}
      >Lisää kuva
      </Button>
    </div>
  )
}

export default UploadImage