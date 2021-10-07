import React from 'react'
import { Table, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import InfoBar from './InfoBar'
import { useStore } from '../store'

const RecycleStatistics = () => {
  const { recyclingStats } = useStore()

  let index :number = 1
  return (
    <div>
      <InfoBar header={'Kotitalouden kierrätysavustin'} text={'Seuraa kierrättämiesti tuotteiden lukumääriä.'} />
      <Container id='stat-list' >
        <h2>Kierrätetyt tuotteet</h2>
        <h5>Kierrätysaste: 0%</h5>
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
            {recyclingStats.map(stat =>
              <tr key={stat.product.id}>
                <td>{index++}</td>
                <td>
                  <Link to={`/products/${stat.product.id}`}>{stat.product.name}</Link>
                </td>
                <td>{stat.purchaseCount}</td>
                <td>{stat.recycleCount}</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}
export default RecycleStatistics