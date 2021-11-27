import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import RegisterForm from '../components/forms/RegisterForm'
import { userService } from '../services/user'
import { PostRequestResponse } from '../types/requestResponses'
import { User } from '../types/objects'

jest.mock('../services/user')
const userServiceMock = userService as jest.Mocked<typeof userService>

const user: User = {
  dislikes: [],
  id: 1,
  likes: [],
  passwordHash: 'SCIOJGSDKIEF',
  favoriteProducts: [],
  token: 'TOKEN',
  username: 'test'
}

function mockValidRegister() {
  let successfulRegisterResponse: PostRequestResponse = {
    message: 'Rekisteröityminen onnistui!',
    resource: user,
    error: undefined
  }

  userServiceMock.createUser.mockResolvedValue(successfulRegisterResponse);
}

describe('When RegisterForm is rendered', () => {

  let usernameInput: any;
  let passwordInput: any;
  let submitButton: any;
  let component: any;

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    mockValidRegister();

    component = render(
      <RegisterForm userService={userServiceMock} />
    )

    usernameInput = component.container.querySelector('input[name="username"]')
    passwordInput = component.container.querySelector('input[name="password"]')
    submitButton = component.container.querySelector('button[type="submit"]')

    if (usernameInput === null) {
      throw new Error("Username input is null!")
    }
    if (passwordInput === null) {
      throw new Error("Password input is null!")
    }
    if (submitButton === null) {
      throw new Error("Submit Button is null!")
    }
  })

  describe('When valid user input', () => {

    it('Username and password submitted', async () => {

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'Myname' } })
      })
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'myPassword' } })
      })
      await act(async () => {
        fireEvent.click(submitButton)
      })

      expect(userServiceMock.createUser).toBeCalledTimes(1)
    })
  })

  describe('When invalid user input', () => {

    describe('With too short username', () => {
      it('Does not submit', async () => {

        await act(async () => {
          fireEvent.change(usernameInput, { target: { value: 'mm' } })
        })
        await act(async () => {
          fireEvent.change(passwordInput, { target: { value: 'myPassword' } })
        })
        await act(async () => {
          fireEvent.click(submitButton)
        })

        expect(userServiceMock.createUser).toBeCalledTimes(0)
      })
    })

    describe('With too short password', () => {
      it('Does not submit', async () => {

        await act(async () => {
          fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        })
        await act(async () => {
          fireEvent.change(passwordInput, { target: { value: 'mmmmm' } })
        })
        await act(async () => {
          fireEvent.click(submitButton)
        })

        expect(userServiceMock.createUser).toBeCalledTimes(0)
      })
    })
  })

})