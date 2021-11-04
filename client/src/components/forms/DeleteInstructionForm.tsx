import React from 'react'
import ProductService from '../../services/products'
import { useStore } from '../../store'
import { Button } from 'react-bootstrap'
import { Instruction, Product } from '../../types/objects'
import { ErrorResponse } from '../../types/requestResponses'

type Props = {
  instruction: Instruction,
  product: Product
}

const DeleteInstructionForm: React.FC<Props> = ({ product, instruction }) => {
  const creatorId = instruction.creator
  const { user, updateProduct, setNotification } = useStore()

  //ohjeen voi poistaa vain ohjeen luoja
  if (!user || !creatorId) {
    return (null)
  }

  const handleDelete: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    if (window.confirm(`Poistetaanko ohje ${instruction.information}?`)) {
      await ProductService.deleteInstruction(product.id, instruction.id)
        .then((response) => {
          product.instructions = product.instructions.filter(i => i.id !== instruction.id)
          updateProduct(product)
          setNotification(response.message, 'success')
        })
        .catch((error: ErrorResponse) => {
          setNotification((error.message ? error.message : 'Ohjetta poistettaessa tapahtui odottamaton virhe!'), 'error')
        })
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

export default DeleteInstructionForm

