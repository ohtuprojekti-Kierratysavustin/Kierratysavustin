import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import ProductView from '../components/views/ProductView'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import { Product } from '../types/objects'
import { statisticsService } from '../services/statistics'
import { } from 'react-chartjs-2'


jest.mock('../services/statistics')
const statisticsServiceMock = statisticsService as jest.Mocked<typeof statisticsService>

describe('Product view rendered', () => {

  beforeEach(() => {
    statisticsServiceMock.getUserCumulativeRecyclingRatesPerDay.mockResolvedValue([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33.33333333333333])

  })

  afterEach(() => {
    jest.clearAllMocks() // Clear mock return values after each test
  })

  test('Product information can be seen', () => {
    // const productA: Product = {
    //   id: 123,
    //   name: 'Mustamakkarakastike pullo',
    //   instructions: [{
    //     id: 321,
    //     score: 0,
    //     information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.',
    //     product_id: 123,
    //     creator: 1
    //   }],
    //   creator: 123,
    //   productImage: ''
    // }

    // const component = render(
    //   <Router>
    //     <ProductView product={productA} statisticsService={statisticsServiceMock} />
    //   </Router>

    // )

    // expect(component.container).toHaveTextContent(
    //   'Mustamakkarakastike pullo'
    // )
  })

})