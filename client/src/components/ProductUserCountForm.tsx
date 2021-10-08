import React, { useState, useEffect } from 'react'
import productUserCountService, { REQUEST_TYPE } from '../services/productUserCount'
import { Button, Container, Col, ButtonGroup } from 'react-bootstrap'
import '../styles.css'
import { Product } from '../types'
import { useStore } from '../store'
import useInput from '../utils/useInput'
import { isInteger } from '../utils/validation'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

type Props = {
  product: Product,
  countType: REQUEST_TYPE,
  amountText: String,
  sendUpdateText: String,
  redoUpdateText: String,
  tooltipAdd: String,
  tooltipDelete: String
}

// Tooltip napeille, notta mitä tästä lisäyksestä tapahtuu
// Tuotenäkymässä paremmalle
// Input vakiona 1., voi laittaa lisää

const ProductUserCountForm: React.FC<Props> = ({ product, countType, amountText, sendUpdateText, redoUpdateText, tooltipAdd, tooltipDelete }) => {
  const [count, setCount] = useState<number>(0)
  const amountToAdd = useInput<number>(1, 1)
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
        setCount(count + Number(amountToAdd.value))
      })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe!'), 'error')
      })
  }

  const handleRedo: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await productUserCountService.updateCount({ productID: product.id, amount: -amountToAdd.value, type: countType })
      .then(() => {
        setCount(count - Number(amountToAdd.value))
      })
      .catch((error) => {
        setNotification((error.response.data.message ? error.response.data.message : 'Tapahtui odottamaton virhe'), 'error')
      })
  }

  return (
    <div>
      <Container id='vote-element' >
        <Col>
          <Container id='votes'>
            <ButtonGroup vertical className='better-votes'>
              {amountText} <br></br>{count} kpl
              <OverlayTrigger placement="top" overlay={<Tooltip id='buttonTooltip'>{tooltipAdd}</Tooltip>}>
                <Button disabled={inputInvalid} variant='success' id='addCountButton' onClick={handleAddCount} >
                  {sendUpdateText}
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id='buttonTooltip'>{tooltipDelete}</Tooltip>}>
                <Button disabled={inputInvalid} variant='danger' id='redoButton' onClick={handleRedo}>
                  {redoUpdateText}
                </Button>
              </OverlayTrigger>
              <input id='input-field' type='number' value={amountToAdd.value} onChange={onInputChange}></input>
            </ButtonGroup>
          </Container>
        </Col>
      </Container>

    </div>

  )
}

export default ProductUserCountForm