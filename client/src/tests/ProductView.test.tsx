import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import ProductView from '../components/views/ProductView'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import { Product } from '../types/objects'
import { statisticsService } from '../services/statistics'
import { } from 'react-chartjs-2'
import { } from '../components/RecycleGraph'
import 'jest-canvas-mock';


jest.mock('../services/statistics')
jest.mock('react-chartjs-2', () => ({
  Line: () => null
}));
const statisticsServiceMock = statisticsService as jest.Mocked<typeof statisticsService>

describe('Product view rendered', () => {

  beforeEach(() => {
    statisticsServiceMock.getUserCumulativeRecyclingRatesPerDay.mockResolvedValue([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50])

  })

  afterEach(() => {
    jest.clearAllMocks() // Clear mock return values after each test
  })

  test('Product information can be seen', () => {

    const productA: Product = {
      id: 123,
      name: 'Mustamakkarakastike pullo',
      instructions: [{
        id: 321,
        score: 0,
        information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.',
        product_id: 123,
        creator: 1
      }],
      creator: 123,
      productImage: ''
    }

    const component = render(
      <Router>
        <ProductView product={productA} statisticsService={statisticsServiceMock} />
      </Router>
    )
    expect(component.container).toHaveTextContent(
      'Mustamakkarakastike pullo'
    )
  })
  
  test('chart container can be seen', () => {
    const productA: Product = {
      id: 123,
      name: 'Mustamakkarakastike pullo',
      instructions: [{
        id: 321,
        score: 0,
        information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.',
        product_id: 123,
        creator: 1
      }],
      creator: 123,
      productImage: ''
    }

    const component = render(
      <Router>
        <ProductView product={productA} statisticsService={statisticsServiceMock} >
        </ProductView>
      </Router>
    )
    
    const div = component.container.querySelector('.collapse')
    const button = component.getByText('Katso tuotteen tilastot')
    fireEvent.click(button)
    expect(component.container).toHaveTextContent('Tuotteen \'' + 'Mustamakkarakastike pullo' + '\' kierrätysaste viimeisen 30 päivän aikana')
  })

  test('Instructions are listed', () => {
    const productA: Product = {
      id: 123,
      name: 'Mustamakkarakastike pullo',
      instructions: [{
        id: 321,
        score: 0,
        information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.',
        product_id: 123,
        creator: 1
      }],
      creator: 123,
      productImage: ''
    }

    const component = render(
      <Router>
        <ProductView product={productA} statisticsService={statisticsServiceMock} />
      </Router>
    )
    expect(component.container).toHaveTextContent(
      'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erill'
    )
  })

})