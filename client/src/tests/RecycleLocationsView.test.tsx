import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { ErrorResponse, PostRequestResponse } from '../types/requestResponses'
import { waitFor } from '@testing-library/dom'
import { kierratysInfoService } from '../services/kierratysInfo'
import { credentialService } from '../services/credentials'
import RecycleLocationsView from '../components/views/RecycleLocationsView'
import { recycleMaterials, validLocation1, validLocation2 } from './testdata/recycleLocations'

// https://stackoverflow.com/questions/49263429/jest-gives-an-error-syntaxerror-unexpected-token-export
// fixed in package.json with:
  // "jest": {
  //   "transformIgnorePatterns": [
  //     "node_modules/(?!react-checkbox-group|CheckboxGroup)"
  //   ]
  // }


jest.mock('../services/kierratysInfo')
const kierratysInfoServiceMock = kierratysInfoService as jest.Mocked<typeof kierratysInfoService>
jest.mock('../services/credentials')
const credentialServiceMock = credentialService as jest.Mocked<typeof credentialService>

describe('When RecycleLocationsView is rendered', () => {

  let searchButton: any;
  let component: any;
  let searchField: any

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {

    kierratysInfoServiceMock.getAllRecyclingMaterials.mockResolvedValue(recycleMaterials)
    kierratysInfoServiceMock.getCollectionSpotsByPostalCode.mockResolvedValue(validLocation1)
    kierratysInfoServiceMock.getCollectionSpotsByMunicipality.mockResolvedValue(validLocation2)
    credentialServiceMock.getCredentialsFor.mockResolvedValue('123abc')

    component = render(
      <RecycleLocationsView kierratysInfoService={kierratysInfoServiceMock} credentialService={credentialServiceMock} />
    )

    searchButton = component.container.querySelector('button[type="submit"]')
    searchField = component.container.querySelector('input[type="text"]')

    if (searchButton === null) {
      throw new Error("Search Button is null!")
    }
    if (searchField === null) {
      throw new Error("Search Button is null!")
    }
  })

  describe('Using the search field', () => {

    it('it should use the municipality endpoint when searching with a name', async () => {
      await act(async () => {
        fireEvent.change(searchField, { target: { value: 'Helsinki' } })
      })

      await act(async () => {
        fireEvent.click(searchButton)
      })

      expect(kierratysInfoServiceMock.getCollectionSpotsByMunicipality).toBeCalledTimes(1)
    })

    it('should use the postalcode endpoint when using a valid postal code', async () => {
      await act(async () => {
        fireEvent.change(searchField, { target: { value: '12345' } })
      })

      await act(async () => {
        fireEvent.click(searchButton)
      })

      expect(kierratysInfoServiceMock.getCollectionSpotsByPostalCode).toBeCalledTimes(1)
    })
  })
})