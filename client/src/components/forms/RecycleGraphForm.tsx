import React, { useState, useEffect } from 'react'
import RecycleGraph from '../RecycleGraph'
import { statisticsService } from '../../services/statistics'
import { endOfDay } from 'date-fns'
import { Product, ProductStatistic } from '../../types/objects'
import { DropdownButton, Dropdown, Container } from 'react-bootstrap'

type Props = {
  products: ProductStatistic[] | null | undefined,
  product: Product | null | undefined
}

const RecycleGraphForm: React.FC<Props> = ({ products, product }) => {

  if (products && product) {
    return (<p>{'Both products list and single product given! Give only one!'}</p>)
  }

  const [data, setData] = useState([0])
  const [productID, setProductID] = useState(product?.id)
  // const [productName, setProductName] = useState('Kokonaiskierrätysaste')
  const [date,] = useState(new Date())
  const numberOfDays = 30


  useEffect(() => {
    const getGraphData = () => {
      return statisticsService.getUserCumulativeRecyclingRatesPerDay(endOfDay(date).getTime(), numberOfDays, productID)
    }
    getGraphData().then(res => {
      setData(res)
    })
  }, [productID])

  if (products) {

    const handleSelect = (event: any) => {
      console.log(event)
      setProductID(event)
    }

    return (
      <div>
        <Container>
          <DropdownButton onSelect={handleSelect} id="graafi-dropdown" title="Valitse näytettävä tilasto">
            <Dropdown.Item as="button">Kokonaiskierrätysaste</Dropdown.Item>
            <Dropdown.Divider />
            {products.map(stat =>
              <Dropdown.Item key={stat.product.id} as="button" eventKey={stat.product.id.toString()}>{stat.product.name}</Dropdown.Item>
            )}
          </DropdownButton>
        </Container>
        <RecycleGraph data={data}></RecycleGraph>
      </div>
    )
  } else if (product) {
    return (
      <div>
        <RecycleGraph data={data}></RecycleGraph>
      </div>
    )
  } else {
    return (<p>{'Products and product are null! Give atleast one!'}</p>)
  }


}

export default RecycleGraphForm