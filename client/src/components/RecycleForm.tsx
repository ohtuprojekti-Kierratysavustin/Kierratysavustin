import React, { useState, useEffect } from 'react'
import recycleService from '../services/productUserCount'
import { Button, Container, Row, ButtonGroup } from 'react-bootstrap'
import '../styles.css'
import { Product } from '../types'
import { useStore } from '../store'

type Props = {
  product: Product
}

const RecycleForm: React.FC<Props> = ({ product }) => {
  const [recycles, setRecycles] = useState<number>(0)
  const { setNotification, clearNotification } = useStore()

  useEffect(() => {
    const getRecycles = async () => {
      await recycleService.getProductUserCounts({ productID: product.id })
        .then(recycles => setRecycles(recycles.recycleCount))
        .catch((error) => {
          setNotification(error.response.data.message, 'error')
        })
    }
    getRecycles()
  }, [recycles])

  const handleRecycle: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await recycleService.updateCount({ productID: product.id, amount: 1, type: recycleService.REQUEST_TYPE.RECYCLE })
      .then(() => { setRecycles(recycles + 1) })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe lisätessä tuotteen kierrätystilastoa!'), 'error')
      })
  }

  const handleUnrecycle: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await recycleService.updateCount({ productID: product.id, amount: -1, type: recycleService.REQUEST_TYPE.RECYCLE })
      .then(() => { setRecycles(recycles - 1) })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe vähennettäessä tuotteen kierrätystilastoa!'), 'error')
      })
  }

  return (
    <div>
      <Container id='vote-element' >
        <Row>
          <Container id='votes'>
            Kierrätetty {recycles} kpl
            <ButtonGroup vertical className='better-votes'>
              <Button variant='success' id="recycleButton" onClick={handleRecycle} >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                </svg>
              </Button>
              <Button variant='warning' id="unrecycleButton" onClick={handleUnrecycle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                </svg>
              </Button>
            </ButtonGroup>
          </Container>

        </Row>
      </Container>

    </div>

  )
}

export default RecycleForm