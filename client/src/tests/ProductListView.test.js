import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import ProductListView from '../components/views/ProductListView'
import {
  BrowserRouter as Router
} from 'react-router-dom'


test('ProductListView list products', () => {
  const productA = {
    id: '1',
    name: 'Mustamakkarakastike pullo',
    instructions: [{
      id: 'tuote1',
      information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
    }]
  }

  const productB = {
    id: '2',
    name: 'Sanomalehti',
    instructions: [{
      id: 'tuote2',
      information: 'Laita lehti paperinkeräykseen'
    }]
  }

  const productC = {
    id: '3',
    name: 'Aikakauslehti',
    instructions: [{
      id: 'tuote3',
      information: 'Laita aikauslehti paperinkeräykseen'
    }]
  }

  const productsData = [
    productA,
    productB,
    productC
  ]


  const component = render(
    <Router>
      <ProductListView products={productsData} />
    </Router>
  )

  expect(component.container).toHaveTextContent(
    'Mustamakkarakastike pullo'
  )

  expect(component.container).toHaveTextContent(
    'Sanomalehti'
  )

  expect(component.container).toHaveTextContent(
    'Aikakauslehti'
  )

})

test('ProductListView shows message when list is empty', () => {
  const productsData = []

  const component = render(
    <Router>
      <ProductListView filteredProducts={productsData} />
    </Router>
  )

  expect(component.container).toHaveTextContent(
    'Haulla ei löytynyt yhtään tuotetta!'
  )
})