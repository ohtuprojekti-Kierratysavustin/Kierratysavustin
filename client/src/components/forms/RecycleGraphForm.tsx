import React, { useState, useEffect } from 'react'
import RecycleGraph from '../RecycleGraph'
import { StatisticsService } from '../../services/statistics'
import { endOfDay } from 'date-fns'
import { ProductStatistic } from '../../types/objects'
import { DropdownButton, Dropdown, Container } from 'react-bootstrap'

type Props = {
  products: ProductStatistic[],
  statisticsService: StatisticsService
}

const RecycleGraphForm: React.FC<Props> = ({ products, statisticsService }) => {

  const [data, setData] = useState([0])
  const [productID, setProductID] = useState(undefined)
  const [date,] = useState(new Date())
  const numberOfDays = 30

  useEffect(() => {
    statisticsService.getUserCumulativeRecyclingRatesPerDay(endOfDay(date).getTime(), numberOfDays, productID).then(res => {
      setData(res)
    })
  }, [productID])

  const handleSelect = (event: any) => {
    setProductID(event)
  }

  const selectedProduct = productID ? products.filter(productToCheck => productToCheck.product.id === productID)[0].product.name : 'Kokonaiskierrätysaste'

  return (
    <div>
      <Container>
        <DropdownButton onSelect={handleSelect} id="graafi-dropdown" title={!selectedProduct ? 'Valitse näytettävä tilasto' : selectedProduct}>
          <Dropdown.Item as="button">Kokonaiskierrätysaste</Dropdown.Item>
          <Dropdown.Divider />
          {products.map(stat =>
            <Dropdown.Item key={stat.product.id} as="button" eventKey={stat.product.id.toString()}>{stat.product.name}</Dropdown.Item>
          )}
        </DropdownButton>
      </Container>
      <RecycleGraph data={data} graphTargetHeader={(productID ? 'Tuotteen \'' + selectedProduct + '\' kierrätysaste' : 'Kokonaiskierrätysaste')}></RecycleGraph>
    </div>
  )
}

export default RecycleGraphForm