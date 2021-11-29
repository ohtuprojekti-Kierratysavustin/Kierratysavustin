import React, { useState, useEffect } from 'react'
import RecycleGraph from '../RecycleGraph'
import { productUserCountService } from '../../services/productUserCount'
import { endOfDay } from 'date-fns'
import { ProductStatistic } from '../../types/objects'
import { DropdownButton, Dropdown } from 'react-bootstrap'

type Props = {
  products: ProductStatistic[]
}

const RecycleGraphForm: React.FC<Props> = ({ products }) => {
  const [data, setData] = useState([0])
  const [productID,setProductID] = useState(undefined)
  const [date,] = useState(new Date())
  const numberOfDays = 30

  useEffect(() => {
    const getGraphData = () => {
      return productUserCountService.getGraphStatistics(endOfDay(date).getTime(), numberOfDays, productID)
    }
    getGraphData().then(res => {
      setData(res)
    })
  }, [productID])

  const handleSelect = (event: any) => {
    setProductID(event)
  }

  return (
    <div>
      <DropdownButton onSelect={handleSelect} id="graafi-dropdown" title="Valitse näytettävä tilasto">
        <Dropdown.Item as="button">Kokonaiskierrätysaste</Dropdown.Item>
        <Dropdown.Divider />
        {products.map(stat =>
          <Dropdown.Item key={stat.productID.id} as="button" eventKey={stat.productID.id.toString()}>{stat.productID.name}</Dropdown.Item>
        )}
      </DropdownButton>
      <RecycleGraph data={data}></RecycleGraph>
    </div>
  )
}

export default RecycleGraphForm