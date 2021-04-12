import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import InstructionForm from '../components/InstructionForm'

test('InstructionForm renders', () => {

  const component = render(
    <InstructionForm />
  )

  expect(component.container).toHaveTextContent(
    'Anna kierrätysohje: Lisää ohje'
  )

})
