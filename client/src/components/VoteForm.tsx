import React, { useState,useEffect } from 'react'
import userService from '../services/user'
import { useStore } from '../store'
import { Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap'
import '../styles.css'
import { Instruction, User, Product } from '../types'

type Props = {
  instruction: Instruction,
  user: User | null,
  product: Product
}

const VoteForm: React.FC<Props> = ( { instruction, user, product }  ) => {
  const { likes, setLikes } = useStore()
  const { dislikes, setDislikes } = useStore()
  const [like, setLike] = useState(likes.some(p => p === instruction.id))
  const [disLike, setDislike] = useState(dislikes.some(p => p === instruction.id))
  useEffect(( ) => { setLike(likes.some(p => p === instruction.id))
    setDislike(dislikes.some(p => p === instruction.id))
  })
  const [votes, setVotes] = useState(instruction.score)
  //const labelLike = like ? 'Poista Like' : 'Like'
  const labelLikeVariant = like ? 'success' : 'outline-success'

  //const labelDislike = disLike ? 'Poista Dislike' : 'Dislike'
  const labelDislikeVariant = disLike ? 'danger' : 'outline-danger'

  if (!instruction.id) return null
  const handleLike: React.MouseEventHandler<HTMLElement> = (event) => {
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
      userService.removeLike(instruction.id).then(instruction => setVotes(instruction.score))
    } else {
      setLike(true)
      // i can't be used in setVotes as a parameter
      // eslint-disable-next-line
      userService.addLike(instruction.id).then(i => setLikes(likes.concat(i.id))).then(i => setVotes(instruction.score))
      instruction.score += 1
      if(disLike){
        instruction.score += 1
        const newArray = dislikes
        for(var j = 0; j < Object.keys(dislikes).length; j++){
          if(newArray[j] === instruction.id){
            newArray.splice(j)
          }
        }
        setDislikes(newArray)
        setDislike(false)
      }

    }

    product.instructions.sort((a,b) => b.score - a.score)

  }

  const handleDislike: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault()
    if(disLike){
      instruction.score += 1
      setDislike(false)
      const newArray = dislikes
      for(var i = 0; i < Object.keys(dislikes).length; i++){
        if(newArray[i] === instruction.id){
          newArray.splice(i)
        }
      }

      setDislikes(newArray)
      userService.removeDislike(instruction.id).then(instruction => setVotes(instruction.score))

    } else {
      setDislike(true)
      instruction.score -= 1
      if(like){
        instruction.score -= 1
        setLike(false)
        const newArray = likes
        for(var k = 0; k < Object.keys(likes).length; k++){
          if(newArray[k] === instruction.id){
            newArray.splice(k)
          }
        }

        setLikes(newArray)
      }
      // i can't be used in setVotes as a parameter
      // eslint-disable-next-line
      userService.addDislike(instruction.id).then(i => setDislikes(dislikes.concat(i.id))).then(i => setVotes(instruction.score))
    }

    product.instructions.sort((a,b) => b.score - a.score)
  }
  return (
    <div>
      {user !== null ? (
        <Container id='vote-element' >
          <Row>
            <Container id='votes'>
              {votes}
              <ButtonGroup vertical className='better-votes'>
                <Button variant={labelLikeVariant} id = "likeButton" onClick={handleLike} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                  </svg>
                </Button>
                <Button variant={labelDislikeVariant} id = "dislikeButton"  onClick={handleDislike}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                  </svg>
                </Button>
              </ButtonGroup>
            </Container>

          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              {votes}
            </Col>
          </Row>
        </Container>
      )}

    </div>

  )
}

export default VoteForm