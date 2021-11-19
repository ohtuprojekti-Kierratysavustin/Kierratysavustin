import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { ErrorResponse, PostRequestResponse } from '../types/requestResponses'
import { waitFor } from '@testing-library/dom'
import { kierratysInfoService } from '../services/kierratysInfo'
import RecycleLocationsView from '../components/views/RecycleLocationsView'

/**
 * ProductUserCount service has been mocked with jest. The return values of nth calls to the service functions are set manually
 * with mockResolvedValueOnce and mockResolvedValue.
 */


jest.mock('../services/kierratysInfo')
const kierratysInfoServiceMock = kierratysInfoService as jest.Mocked<typeof kierratysInfoService>

describe('When RecycleLocationsView is rendered', () => {

  // let searchButton: any;
  // let component: any;

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {

    // component = render(
    //   <RecycleLocationsView kierratysInfoService={kierratysInfoServiceMock} />
    // )

    // searchButton = component.container.querySelector('button[type="submit"]')

    // if (searchButton === null) {
    //   throw new Error("Search Button is null!")
    // }
  })

  describe('', () => {

    it('', async () => {

    })
  })


})