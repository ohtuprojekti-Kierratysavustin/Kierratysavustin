import React, { useEffect } from 'react'
import InstructionForm from './InstructionForm'
import FavoritesForm from './FavoritesForm'
import { useStore } from '../App'
import VoteForm from './VoteForm'
/** Component for showing product name and recycling information. */
const Product = ({ product }) => {
  const { user, clearNotification } = useStore()

  useEffect(() => {
    clearNotification()
  }, [])

  if (!product) return null

  return (
    <div>
      <h2>{product.name}</h2>
      <h3>Kierrätys ohjeet</h3>
      {product.instructions.map(info =>
        <li id ="productInstruction" key={info.id}>
          {info.information}
          {user !== null ? (
            <div>
              <VoteForm instruction = {info}/>
            </div>
          ) : (
            ''
          )}

        </li>
      )}

      {user !== null ? (
        <div>
          <FavoritesForm product = {product}/>
          <h2>Lisää tuotteelle kierrätysohje</h2>
          <InstructionForm product = {product}/>
        </div>
      ) : (
        ''
      )}


    </div>
  )
}

export default Product