import React, { useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'

const VoteForm = ( { instruction }  ) => {
  const { likes, setLikes } = useStore()
  const { dislikes, setDislikes } = useStore()
  const [like, setLike] = useState(likes.some(p => p === instruction.id))
  const [disLike, setDislike] = useState(dislikes.some(p => p === instruction.id))
  const [votes, setVotes] = useState(instruction.score)
  const labelLike = like ? 'Poista Like' : 'Like'

  const labelDislike = disLike ? 'Poista Dislike' : 'Dislike'

  if (!instruction.id) return null
  const handleLike = (event) => {
    event.preventDefault()
    if(like){

      setLike(false)
      const newArray = likes
      for(var i = 0; i < Object.keys(likes).length ; i++ ) {
        if(newArray[i] === instruction.id){
          newArray.splice(i)
        }
      }

      instruction.score += -1
      setLikes(newArray)
      productService.removeLike(instruction.id).then(instruction => setVotes(instruction.score))
    } else {
      setLike(true)
      productService.addLike(instruction.id).then(setLikes(likes.concat(instruction.id))).then(instruction => setVotes(instruction.score))
      instruction.score += 1
      if(disLike){
        instruction.score += 1
        const newArray = dislikes
        for(var j = 0; j < Object.keys(dislikes).length; j++){
          if(newArray[j] === instruction.id.toString()){
            newArray.splice(j)
          }
        }
        setDislikes(newArray)
        setDislike(false)
      }

    }

  }

  const handleDislike= (event) => {
    event.preventDefault()
    if(disLike){
      instruction.score += 1
      setDislike(false)
      const newArray = dislikes
      for(var i = 0; i < Object.keys(dislikes).length; i++){
        if(newArray[i] === instruction.id.toString()){
          newArray.splice(i)
        }
      }

      setDislikes(newArray)
      productService.removeDislike(instruction.id).then(instruction => setVotes(instruction.score))

    } else {
      setDislike(true)
      instruction.score -= 1
      if(like){
        instruction.score -= 1
        setLike(false)
        const newArray = likes
        for(var k = 0; k < Object.keys(likes).length; k++){
          if(newArray[k] === instruction.id.toString()){
            newArray.splice(k)
          }
        }

        setLikes(newArray)
      }

      productService.addDislike(instruction.id).then(setDislikes(dislikes.concat(instruction.id))).then(instruction => setVotes(instruction.score))
    }
  }
  return (
    <div>
      <button id = "likeButton" onClick={handleLike}>
        {labelLike}
      </button>
      Äänet: {votes}
      <button id = "dislikeButton"  onClick={handleDislike}>
        {labelDislike}
      </button>
    </div>

  )
}

export default VoteForm