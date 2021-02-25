import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import RegisterForm from '../components/RegisterForm'
test('<RegisterForm /> register form makes new user onSubmit', () => {
  const registerUser = jest.fn()
  const component = render(
    <RegisterForm />
  )
  const usernameInput = component.container.querySelector('input[name="username"]')
  const passwordInput = component.container.querySelector('input[name="password"]')
  const form = component.container.querySelector('form')

  fireEvent.change(usernameInput, { target: { value:'Myname' }  })
  fireEvent.change(passwordInput, { target: { value:'myPassword' }  })
  fireEvent.submit(form)
  expect(registerUser.mock.calls[0][0].username).toBe('Myname')
  expect(registerUser.mock.calls[0][0].password).toBe('myPassword')
} )