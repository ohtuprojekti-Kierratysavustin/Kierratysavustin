import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { ErrorResponse, PostRequestResponse } from '../types/requestResponses'
import { waitFor } from '@testing-library/dom'
import { kierratysInfoService } from '../services/kierratysInfo'
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

describe('When RecycleLocationsView is rendered', () => {

  let searchButton: any;
  let component: any;

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {

    kierratysInfoServiceMock.getAllRecyclingMaterials.mockResolvedValue(recycleMaterials)

    component = render(
      <RecycleLocationsView kierratysInfoService={kierratysInfoServiceMock} />
    )

    searchButton = component.container.querySelector('button[type="submit"]')

    if (searchButton === null) {
      throw new Error("Search Button is null!")
    }
  })

  describe('', () => {

    it('', async () => {

    })
  })


})