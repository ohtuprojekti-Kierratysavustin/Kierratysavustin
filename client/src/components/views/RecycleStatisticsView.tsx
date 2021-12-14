import React from 'react'
import { Table, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import InfoBar from '../InfoBar'
import { useStore } from '../../store'
import RecycleGraphForm from '../forms/RecycleGraphForm'
import { statisticsService } from '../../services/statistics'


const RecycleStatisticsView = () => {
  const { productStatistics, user } = useStore()

  if (productStatistics.length === 0) {
    return (
      <div>
        <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Seuraa kierrättämiesi tuotteiden lukumääriä.'} />
        <Container id='nostats' >
          {user
            ? <div><p>Voit kirjata tuotteita sovellukseen niitä hankkittuasi, ja merkitä niitä myöhemmin kierrätetyiksi.<br />
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
      product: a.product
    }
  ))

  let index: number = 1
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
              <tr key={stat.product.id} id={`listElement${index}`}>
                <td>{index++}</td>
                <td>
                  <Link to={`/products/${stat.product.id}`}>{stat.product.name}</Link>
                </td>
                <td>{stat.purchaseCount}</td>
                <td>{stat.recycleCount}</td>
                <td>{(stat.recycleCount / stat.purchaseCount * 100).toFixed()} %</td>
              </tr>
            )}
          </tbody>
        </Table>
        <RecycleGraphForm products={productStatistics} statisticsService={statisticsService} />
      </Container>
    </div>
  )
}

export default RecycleStatisticsView