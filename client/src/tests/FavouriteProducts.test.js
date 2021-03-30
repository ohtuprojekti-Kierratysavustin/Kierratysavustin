import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import FavouriteProducts from '../components/FavouriteProducts'
import {
  BrowserRouter as Router
} from 'react-router-dom'

test('FavouriteProducts list products', () => {
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
      <FavouriteProducts products={productsData} />
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