import React, { useEffect, useState } from 'react'
import { Table, Container } from 'react-bootstrap'
import { productUserCountService } from '../../services/productUserCount'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import InfoBar from '../InfoBar'
import { useStore } from '../../store'



const RecycleStatisticsView = () => {
  const { productStatistics, user } = useStore()

  const [data, setData] = useState([0])
  useEffect(() => {
    const getGraphData = () => {
      return productUserCountService.getGraphStatistics(30)
    }
    getGraphData().then(res => {
      console.log(res)
      setData(res)
    })
  }, [])

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

  type dataValues = {
    labels: number[],
    datasets: [
      {
        label: string,
        data: number[],
        fill: boolean,
        borderColor: string
      }
    ]
  }

  //kuvaajan testaamiseen, koska ei vielä bäkkäriä mistä oikea data
  /*
  const chartDataForTesting: dataValues = {
    labels: [1,2,3,4,5,6,7],
    datasets: [
      {
        label: 'Päivittäinen kierrätysaste',
        data: [0.3,0.3,0.5,0.6,0.6,0.87,0.6],
        fill: false,
        borderColor: '#137447'
      }
    ]
  }
  */

  //data kuvaajaan


  const chartData: dataValues = {
    labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    datasets: [
      {
        label: 'Päivittäinen kierrätysaste',
        data: data,
        fill: false,
        borderColor: '#137447'
      }
    ]
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
        <br></br>
        <h5>Kokonaiskerrätysaste viimeisen 30 päivän aikana</h5>
        <Line data={chartData} />
      </Container>
    </div>
  )
}
export default RecycleStatisticsView