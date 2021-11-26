import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { productUserCountService } from '../services/productUserCount'
import { Line } from 'react-chartjs-2'
import { useStore } from '../store'
import { startOfDay, endOfDay, subDays } from 'date-fns'

type Props = {
  numberOfDays: number
}

const RecycleGraph: React.FC<Props> = ({ numberOfDays }) => {
  const { user } = useStore()
  const [data, setData] = useState([0])

  useEffect(() => {
    const getGraphData = () => {
      const today = new Date()
      const previousDate = subDays(today, (numberOfDays-2) )
      return productUserCountService.getGraphStatistics(startOfDay(previousDate).getTime(), endOfDay(today).getTime())
    }
    getGraphData().then(res => {
      setData(res)
    })
  }, [user])

  // kuvaajan datan tyyppi
  type dataValues = {
    labels: string[],
    datasets: [
      {
        label: string,
        data: number[],
        fill: boolean,
        borderColor: string
      },
      {
        label: string,
        data: number[],
        pointRadius: number,
        borderColor: string
      }
    ]
  }

  // päivämäärät x-akselille
  const today: Date = new Date()
  const dates: string[] = []
  for (let i = numberOfDays-1; i >= 0; i--) {
    const date: Date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(`${date.getDate()}.${date.getMonth() + 1}.`)
  }

  // data for the EU's goal precentage
  let goalPrecentage: number[] = []
  for (let i=0; i < numberOfDays; i++) {
    goalPrecentage.push(55)
  }

  // data kuvaajaan
  const chartData: dataValues = {
    labels: dates,
    datasets: [
      {
        label: 'Päivittäinen kierrätysaste',
        data: data,
        fill: false,
        borderColor: '#137447',
      },
      {
        label: '55% - EU:n tavoite kotitalousjätteen kierrätysasteelle vuonna 2025',
        data: goalPrecentage,
        pointRadius: 0,
        borderColor: '#a4c2a6'
      }
    ]
  }

  // kuvaajan y-akseli välille 0-100
  const options :any = {
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }

  return (
    <div>
      <Container id='stat-chart'>
        <br></br>
        <h5>Kokonaiskierrätysaste viimeisen {numberOfDays} päivän aikana</h5>
        <Line className='RecycleGraph' data={chartData} options={options} />
      </Container>
    </div>
  )
}

export default RecycleGraph