import React,{ useState } from 'react'
import { Button } from 'react-bootstrap'
//import productService from '../services/products'
import fileService from '../services/files'
import { useStore } from '../store'

import { Product } from '../types/objects'

//const FormData = require('form-data')

type Props = {
  product: Product
}

const UploadImage: React.FC<Props> = ({ product }) => {
  const productCreatorId = product.user
  const { user, setNotification/*, products, setProducts */ } = useStore()
  //const history = useHistory()
  const [selectedFile, setSelectedFile] = useState('')
  const [isFilePicked, setIsFilePicked] = useState(false)

  if (!user || !productCreatorId) {
    return (null)
  }

  const handleInputChange = (event: any) => {
    setSelectedFile(event.target.files[0])
    console.log('target:' +event.target.files[0].name)
    console.log('kuva: '+selectedFile.toString)
    setIsFilePicked(true)
    console.log('isfilepicked: '+isFilePicked)
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('image', selectedFile)
    console.log(formData.get('image'))
    if (isFilePicked && window.confirm(`Lisää kuva ${selectedFile} tuotteelle ${product.name}?`)) {
      await fileService.addProductImage(product.id, formData)
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
        <input type="file" name="file" accept='image/*' onChange={handleInputChange} />
        <div>
          <Button
            id='uploadImage'
            variant='success'
            size='sm'
            onClick={handleClick}
            disabled={!isFilePicked}
          >Lisää kuva
          </Button>
        </div>
      </div>
    )
  }
  return (null)
}

export default UploadImage