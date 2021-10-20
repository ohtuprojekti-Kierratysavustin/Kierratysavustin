import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import ProductPageView from '../components/views/ProductView'
import {
  BrowserRouter as Router
} from 'react-router-dom'


test('Product information can be seen', () => {
  const productA = {
    id: '1',
    name: 'Mustamakkarakastike pullo',
    instructions: [{
      id: 'tuote1',
      information: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
    }]
  }

  const component = render(
    <Router>
      <ProductPageView product={productA} />
    </Router>

  )

  expect(component.container).toHaveTextContent(
    'Mustamakkarakastike pullo'
  )
})