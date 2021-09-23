import React from 'react'
import ProductService from '../services/products'
import { useStore } from '../store'
import { Button } from 'react-bootstrap'

const DeleteInstructionForm = ( { product, instruction } ) => {
  const creatorId = instruction.user
  const { user, setNotification } = useStore()

  //ohjeen voi poistaa vain ohjeen luoja
  if (!user || !creatorId) {
    return (null)
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    try{
      ProductService.deleteInstruction(product.id, instruction.id)
      window.location.reload()
      setNotification(`ohje ${instruction.information} poistettu`)
    } catch (e) {
      setNotification('Ohjeen poistamisessa tapahtui virhe', 'error')
    }

  }
  if (user.id === creatorId) {
    return (
      <div>
        <Button
          id='deleteInstructionButton'
          variant='outline-danger'
          onClick={handleDelete}
        >Poista
        </Button>
      </div>
    )
  } else {
    return (null)
  }
}

export default  DeleteInstructionForm

