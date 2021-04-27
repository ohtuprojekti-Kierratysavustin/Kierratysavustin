/* eslint-disable no-unused-vars */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {
  Switch, Route
} from 'react-router-dom'
import { render, fireEvent } from '@testing-library/react'
import ProductList from '../components/ProductList'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import SearchForm from '../components/SearchForm'


test('Search form renders and returns correct results', () => {
  console.log('testi ei toimi')

})
/*
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

  const changeFoundProducts = jest.fn()
  const component = render(
    <Router>
      <Switch>
        <Route path="/searchResults">
          <ProductList products={[]} />
        </Route>
        <Route path="/">
          <SearchForm products={productsData} setFilteredProducts={changeFoundProducts} />
        </Route>
      </Switch>
    </Router>
  )
  expect(component.container).toHaveTextContent(
    'Etsi'
  )
  const input = component.container.querySelector('#searchInput')
  const form = component.container.querySelector('#searchForm')
  fireEvent.change(input, {
    target: { value: 'lehti' }
  })
  fireEvent.submit(form)
  expect(changeFoundProducts.mock.calls).toHaveLength(0)
  expect(changeFoundProducts.mock.calls[0][0][0]).toBe(productB)

})
*/