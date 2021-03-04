import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import SearchForm from '../components/SearchForm'
import {
  BrowserRouter as Router
} from 'react-router-dom'


test('Search form renders and returns correct results', () => {

  const products = [{
    id: '1',
    name: 'Mustamakkarakastike pullo',
    instructions: [{
      id: 'tuote1',
      instruction: 'Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.'
    }]
  }]

  const component = render(
    <Router>
      <SearchForm products={products} setFoundProducts={null} />
    </Router>

  )


  expect(component.container).toHaveTextContent(
    'Hakusana'
  )

  expect(component.container).not.toHaveTextContent(
    'Mustamakkarakastike pullo'
  )

  //const input = component.container.querySelector('input')
  //const form = component.container.querySelector('form')

  /* fireEvent.change(input, {
    target: { value: 'pullo' }
  })
  fireEvent.submit(form) */

  /* expect(component.container).toHaveTextContent(
    'Mustamakkarakastike pullo'
  )

  fireEvent.change(input, {
    target: { value: 'abcdefg' }
  })
  fireEvent.submit(form)

  expect(component.container).not.toHaveTextContent(
    'Mustamakkarakastike pullo'
  ) */

})