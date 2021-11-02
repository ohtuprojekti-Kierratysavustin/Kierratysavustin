import React, { useEffect, useState } from 'react'
import { Table, Container } from 'react-bootstrap'
import { productUserCountService } from '../../services/productUserCount'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import InfoBar from '../InfoBar'
import { useStore } from '../../store'
import { startOfDay, endOfDay, subDays } from 'date-fns'



const RecycleStatisticsView = () => {
  const { productStatistics, user } = useStore()
  const [data, setData] = useState([0])
  const numberOfDays = 30

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

  if (productStatistics.length === 0) {
    return (
      <div>
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Seuraa kierrättämiesi tuotteiden lukumääriä.'} />
        <Container id='nostats' >
          {user
            ? <div><p>Voit kirjata tuotteita sovellukseen niitä hankkittuasi, ja merkitä niitä myöhemmin kierrätetyiksi.<br/>
              Näin tehdessäsi, näet tältä sivulta tietoja kierrättämiesi tuotteiden määristä ja kierrätysasteestasi.</p></div>
            : <h5><Link to={'/login'}>Kirjaudu sisään</Link> nähdäksesi tietoja kierrätyksestäsi</h5>
          }
        </Container>
      </div>
    )
  }
  let totalPurchased = productStatistics.reduce((a, b) => (
    {
      purchaseCount: a.purchaseCount + b.purchaseCount,
      recycleCount: a.recycleCount + b.recycleCount,
      productID: a.productID
    }
  ))

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
  for (let i=0; i < 30; i++) {
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

  let index :number = 1
  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Seuraa kierrättämiesi tuotteiden lukumääriä.'} />
      <Container id='stat-list' >
        <h2>Kierrätetyt tuotteet</h2>
        <h5>Kokonaiskierrätysaste: {(totalPurchased.recycleCount / totalPurchased.purchaseCount * 100).toFixed(1)} %</h5>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Tuote</th>
              <th>Hankittu</th>
              <th>Kierrätetty</th>
              <th>Kierrätysaste</th>
            </tr>
          </thead>
          <tbody>
            {productStatistics.map(stat =>
              <tr key={stat.productID.id} id={`listElement${index}`}>
                <td>{index++}</td>
                <td>
                  <Link to={`/products/${stat.productID.id}`}>{stat.productID.name}</Link>
                </td>
                <td>{stat.purchaseCount}</td>
                <td>{stat.recycleCount}</td>
                <td>{(stat.recycleCount / stat.purchaseCount * 100).toFixed()} %</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Container id='stat-chart'>
        <br></br>
        <h5>Kokonaiskerrätysaste viimeisen 30 päivän aikana</h5>
        <Line className='RecycleGraph' data={chartData} options={options} />
      </Container>
    </div>
  )
}
export default RecycleStatisticsView