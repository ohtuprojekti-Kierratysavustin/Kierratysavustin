import React from 'react'
import ProductService from '../services/products'
import { Button } from 'react-bootstrap'

const DeleteInstructionForm = ( { user, productId, instructionId } ) => {

  const handleDelete = (event) => {
    event.preventDefault()
    ProductService.deleteInstruction(productId, instructionId)
    window.location.reload()
  }
  return (
    <div>
      {user !== null ? (
        <Button
          id='deleteInstructionButton'
          variant='outline-danger'
          onClick={handleDelete}
        >Poista
        </Button>
      ) : (
        ''
      )}
    </div>
  )
}

export default  DeleteInstructionForm

