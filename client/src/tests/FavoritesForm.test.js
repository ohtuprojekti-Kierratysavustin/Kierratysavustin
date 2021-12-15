import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import FavoritesForm from '../components/forms/FavoritesForm'

const user = { id: '123',
  name: 'test'
}
const user2 = { id: '145',
  name: 'test2'
}
const product = { id:'321',
  name: 'Muovipullo',
  users:[ user2]
}
test('FavoritesForm button changes value', () => {
  const component = render(
    <FavoritesForm user = {user} product={product}/>
  )
  const btn = component.getByText('Lisää suosikkeihin')
  fireEvent.click(btn)
  expect(btn.textContent === 'Poista suosikeista')

})