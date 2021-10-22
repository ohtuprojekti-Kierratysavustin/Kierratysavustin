import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import InstructionForm from '../components/forms/InstructionForm'

test('InstructionForm renders', () => {

  const component = render(
    <InstructionForm />
  )

  expect(component.container).toHaveTextContent(
    'Lisää uusi ohje'
  )

})
