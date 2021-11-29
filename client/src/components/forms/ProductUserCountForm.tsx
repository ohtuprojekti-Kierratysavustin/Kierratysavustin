import React, { useState, useEffect } from 'react'
import { CounterService, PRODUCT_USER_COUNT_REQUEST_TYPE } from '../../services/counters'
import { Button, Container, Col, ButtonGroup } from 'react-bootstrap'
import '../../styles.css'
import { Product } from '../../types/objects'
import { useStore } from '../../store'
import useInput from '../../utils/useInput'
import { isInteger } from '../../utils/validation'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { ErrorResponse } from '../../types/requestResponses'

type Props = {
  product: Product,
  countType: PRODUCT_USER_COUNT_REQUEST_TYPE,
  amountText: string,
  sendUpdateText: string,
  subtractUpdateText: string,
  tooltipAdd: string,
  tooltipDelete: string,
  counterService: CounterService
}

const ProductUserCountForm: React.FC<Props> = ({ product, countType, amountText, sendUpdateText, subtractUpdateText, tooltipAdd, tooltipDelete, counterService }) => {
  const [count, setCount] = useState<number>(0)
  const amountToAdd = useInput<number>(1, 1)
  const [inputInvalid, setInputInvalid] = useState<boolean>(false)
  const { setNotification, clearNotification, updateProductStatistics } = useStore()

  const onInputChange = (event: any) => {
    if (isInteger(event.target.value) && Number.parseInt(event.target.value) > 0) {
      setInputInvalid(false)
      clearNotification()
    } else {
      setInputInvalid(true)
      setNotification('Syötteen on oltava positiivinen kokonaisluku', 'error')
    }
    amountToAdd.onChange(event)
  }

  useEffect(() => {
    const getCounts = async () => {
      await counterService.getProductUserCounts(product.id)
        .then(counts => setCount(counts[countType]))
        .catch((error: ErrorResponse) => {
          setNotification(error.message, 'error')
        })
    }
    getCounts()
  }, [count])

  const updateStatsInStore = (purchases: number, recycles: number) => {
    updateProductStatistics({
      productID: product,
      purchaseCount: purchases,
      recycleCount: recycles,
    })
  }

  const handleAddCount: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await counterService.updateProductUserCount({ productID: product.id, amount: amountToAdd.value, type: countType })
      .then((result) => {
        setCount(count + Number(amountToAdd.value))
        updateStatsInStore(result.resource.purchaseCount, result.resource.recycleCount)
      })
      .catch((error: ErrorResponse) => {
        setNotification((error.message ? error.message : 'Tapahtui odottamaton virhe!'), 'error')
      })
  }

  const handleSubtractCount: React.MouseEventHandler<HTMLElement> = async (event) => {
    event.preventDefault()
    clearNotification()
    await counterService.updateProductUserCount({ productID: product.id, amount: -amountToAdd.value, type: countType })
      .then((result) => {
        setCount(count - Number(amountToAdd.value))
        updateStatsInStore(result.resource.purchaseCount, result.resource.recycleCount)
      })
      .catch((error: ErrorResponse) => {
        setNotification((error.message ? error.message : 'Tapahtui odottamaton virhe'), 'error')
      })
  }

  return (
    <div>
      <Container id={'count-element' + product.id + countType} >
        <Col>
          <Container id='productUserCountContainer'>
            <ButtonGroup vertical>
              {amountText} <br></br>{count} kpl
              <OverlayTrigger placement="top" overlay={<Tooltip id={'buttonTooltipAdd' + product.id + countType}>{tooltipAdd}</Tooltip>}>
                <Button disabled={inputInvalid} variant='success' id={'addCountButton' + product.id + countType} onClick={handleAddCount} >
                  {sendUpdateText}
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id={'buttonTooltipSubtract' + product.id + countType}>{tooltipDelete}</Tooltip>}>
                <Button disabled={inputInvalid} variant='danger' id={'subtractCountButton' + product.id + countType} onClick={handleSubtractCount}>
                  {subtractUpdateText}
                </Button>
              </OverlayTrigger>
              <input id={'countInput' + product.id + countType} type='number' value={amountToAdd.value} onChange={onInputChange} className='count-input' onClick={(event: any) => event.preventDefault()}></input>
            </ButtonGroup>
          </Container>
        </Col>
      </Container>

    </div>

  )
}

export default ProductUserCountForm