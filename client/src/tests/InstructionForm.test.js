import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import InstructionForm from '../components/forms/InstructionForm'


test('InstructionForm renders', () => {

  const component = render(
    <InstructionForm />
  )
  expect(component.container).toHaveTextContent(
    'Lisää uusi'
  )
})

test('Popup window is shown after pushing the button', () => {

  const component = render(
    <InstructionForm />
  )
  const button = component.getByText('Lisää uusi ohje')
  fireEvent.click(button)
  expect(component.container.parentElement).toHaveTextContent(
    'Uusi kierrätysohje tuotteelle'
  )
})

test('Popup window is closed after pushing x-button', async () => {

  const component = render(
    <InstructionForm />
  )
  const button = component.getByText('Lisää uusi ohje')
  fireEvent.click(button)
  const xButton = component.getByText('Close').closest('button')
  fireEvent.click(xButton)
  await new Promise((r) => setTimeout(r, 2000))
  expect(component.container.parentElement).not.toHaveTextContent(
    'Uusi kierrätysohje tuotteelle'
  )
})
