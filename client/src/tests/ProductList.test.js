import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import ProductList from '../components/ProductList'
import {
  BrowserRouter as Router
} from 'react-router-dom'


test('ProductList list products', () => {
  const productA = {
    id: '1',
    name: 'Mustamakkarakastike pullo',
    instructions: [{
      id: 'tuote1',
      instruction: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
    }]
  }

  const productB = {
    id: '2',
    name: 'Sanomalehti',
    instructions: [{
      id: 'tuote2',
      instruction: 'Laita lehti paperinkeräykseen'
    }]
  }

  const productC = {
    id: '3',
    name: 'Aikakauslehti',
    instructions: [{
      id: 'tuote3',
      instruction: 'Laita aikauslehti paperinkeräykseen'
    }]
  }

  const productsData = [
    productA,
    productB,
    productC
  ]


  const component = render(
    <Router>
      <ProductList products={productsData} />
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

test('ProductList shows message when list is empty', () => {

  const productsData = []


  const component = render(
    <Router>
      <ProductList products={productsData} />
    </Router>
  )

  expect(component.container).toHaveTextContent(
    'Haulla ei löytynyt yhtään tuotetta!'
  )

})