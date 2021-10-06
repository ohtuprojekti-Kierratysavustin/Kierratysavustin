import React, { useState, useEffect } from 'react'
import productUserCountService, { REQUEST_TYPE } from '../services/productUserCount'
import { Button, Container, Row, ButtonGroup } from 'react-bootstrap'
import '../styles.css'
import { Product } from '../types'
import { useStore } from '../store'
import useInput from '../utils/useInput'
import { isInteger } from '../utils/validation'

type Props = {
  product: Product,
  countType: REQUEST_TYPE,
  amountText: String,
  sendUpdateText: String,
  redoUpdateText: String
}

// Tooltip napeille, notta mitä tästä lisäyksestä tapahtuu
// Tuotenäkymässä paremmalle
// Input vakiona 1., voi laittaa lisää

const ProductUserCountForm: React.FC<Props> = ({ product, countType, amountText, sendUpdateText, redoUpdateText }) => {
  const [count, setCount] = useState<number>(0)
  const amountToAdd = useInput<number>(1, 1)
  const [lastAddedAmount, setLastAddedAmount] = useState<number>(0)
  const [inputInvalid, setInputInvalid] = useState<boolean>(false)
  const { setNotification, clearNotification } = useStore()

  const onInputChange = (event: any) => {
    if (isInteger(event.target.value)) {
      setInputInvalid(false)
      clearNotification()
    } else {
      setInputInvalid(true)
      setNotification('Syötteen on oltava kokonaisluku', 'error')
    }
    amountToAdd.onChange(event)
  }

  useEffect(() => {
    const getCounts = async () => {
      await productUserCountService.getProductUserCounts({ productID: product.id })
        .then(counts => setCount(counts[countType]))
        .catch((error) => {
          setNotification(error.response.data.message, 'error')
        })
    }
    getCounts()
  }, [count])

  const handleAddCount: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await productUserCountService.updateCount({ productID: product.id, amount: amountToAdd.value, type: countType })
      .then(() => {
        setLastAddedAmount(amountToAdd.value)
        setCount(count + Number(amountToAdd.value))
      })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe!'), 'error')
      })
  }

  const handleRedo: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    if (lastAddedAmount !== 0) {
      await productUserCountService.updateCount({ productID: product.id, amount: -lastAddedAmount, type: countType })
        .then(() => {
          setCount(count - lastAddedAmount)
          setLastAddedAmount(0)
        })
        .catch((error) => {
          setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe'), 'error')
        })
    }
  }

  return (
    <div>
      <Container id='vote-element' >
        <Row>
          <Container id='votes'>
            {amountText} {count} kpl
            <ButtonGroup vertical className='better-votes'>
              <Button disabled={inputInvalid} variant='success' id="addCountButton" onClick={handleAddCount} >
                {sendUpdateText}
              </Button>
              <Button disabled={lastAddedAmount === 0} variant='warning' id="redoButton" onClick={handleRedo}>
                {redoUpdateText}
              </Button>
              <input type='number' value={amountToAdd.value} onChange={onInputChange}></input>
            </ButtonGroup>
          </Container>

        </Row>
      </Container>

    </div>

  )
}

export default ProductUserCountForm