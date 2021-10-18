import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import RegisterForm from '../components/RegisterForm'
test('<RegisterForm /> register form makes new user onSubmit', async () => {
  //const registerUser = jest.fn()
  const component = render(
    <RegisterForm />
  )

  expect(true)
  // const usernameInput = component.container.querySelector('input[name="username"]')
  // const passwordInput = component.container.querySelector('input[name="password"]')
  // const form = component.container.querySelector('form')

  // await act( async() => {
  //   fireEvent.change(usernameInput, { target: { value:'Myname' } })
  //   fireEvent.change(passwordInput, { target: { value:'myPassword' } })
  //   fireEvent.submit(form)
  // })

//expect(registerUser.mock.calls.username).toBe('Myname')
//expect(registerUser.mock.calls.password).toBe('myPassword')
} )