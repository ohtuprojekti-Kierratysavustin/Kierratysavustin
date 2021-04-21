import React, { useState } from 'react'
import productService from '../services/products'
import { useStore } from '../App'

import { Button, Container, Row, Col } from 'react-bootstrap'

const VoteForm = ( { instruction, user, product }  ) => {
  const { likes, setLikes } = useStore()
  const { dislikes, setDislikes } = useStore()
  const [like, setLike] = useState(likes.some(p => p === instruction.id))
  const [disLike, setDislike] = useState(dislikes.some(p => p === instruction.id))
  const [votes, setVotes] = useState(instruction.score)
  const labelLike = like ? 'Poista Like' : 'Like'
  const labelLikeVariant = like ? 'success' : 'outline-success'

  const labelDislike = disLike ? 'Poista Dislike' : 'Dislike'
  const labelDislikeVariant = disLike ? 'danger' : 'outline-danger'

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

    product.instructions.sort((a,b) => b.score - a.score)

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

    product.instructions.sort((a,b) => b.score - a.score)
  }
  return (
    <div>
      {user !== null ? (
        <Container id='vote-element'>
          <Row>
            <Col>
              <Button variant={labelLikeVariant} id = "likeButton" onClick={handleLike}>
                {labelLike}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              Äänet: {votes}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant={labelDislikeVariant} id = "dislikeButton"  onClick={handleDislike}>
                {labelDislike}
              </Button>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              Äänet: {votes}
            </Col>
          </Row>
        </Container>
      )}

    </div>

  )
}

export default VoteForm