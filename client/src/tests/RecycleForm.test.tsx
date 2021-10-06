import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import ProductUserCountForm from '../components/ProductUserCountForm'
import { Product, User } from '../types'

const product: Product = {
  id: 1,
  name: 'Juustoportti suklaamaito',
  instructions: [],
  users: [],
  user: 1
}

describe('When pressing +', () => {
  it('should grow the recycle count', () => {
    const component = render(<ProductUserCountForm product={product} />)
    const recycleButton = component.container.querySelector('#recycleButton')
    const recycleCount = component.container.querySelector('#votes')
    if (recycleButton !== null) {
      fireEvent.click(recycleButton)
    }
    expect(recycleCount?.textContent === 'Kierrätetty 1 kpl')
  })
})

describe('When pressing -', () => {
  it('should reduce the recycle count', () => {
    const component = render(<ProductUserCountForm product={product} />)
    const recycleButton = component.container.querySelector('#recycleButton')
    const unrecycleButton = component.container.querySelector('#unrecycleButton')
    const recycleCount = component.container.querySelector('#votes')
    if (recycleButton !== null) {
      fireEvent.click(recycleButton)
    }
    if (unrecycleButton !== null) {
      fireEvent.click(unrecycleButton)
    }
    expect(recycleCount?.textContent === 'Kierrätetty 0 kpl')
  })
  it('should not reduce the recycle count if the current count is 0', () => {
    const component = render(<ProductUserCountForm product={product} />)
    const unrecycleButton = component.container.querySelector('#unrecycleButton')
    const recycleCount = component.container.querySelector('#votes')
    if (unrecycleButton !== null) {
      fireEvent.click(unrecycleButton)
    }
    expect(recycleCount?.textContent === 'Kierrätetty 0 kpl')
  })
})

