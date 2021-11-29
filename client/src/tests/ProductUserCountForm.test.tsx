import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import ProductUserCountForm from '../components/forms/ProductUserCountForm'
import { Product, ProductUserCount } from '../types/objects'
import { PRODUCT_USER_COUNT_REQUEST_TYPE, counterService } from '../services/counters'
import { ErrorResponse, PostRequestResponse } from '../types/requestResponses'
import { waitFor } from '@testing-library/dom'

/**
 * ProductUserCount service has been mocked with jest. The return values of nth calls to the service functions are set manually
 * with mockResolvedValueOnce and mockResolvedValue.
 */


jest.mock('../services/productUserCount')
const counterServiceMock = counterService as jest.Mocked<typeof counterService>

/**
 * 
 * @param values The return values that the count of the product will take in the lifetime of the test.
 * Last one will become a default value for get.
 * Update will get default return value of 0
 * Negative values will cause reject on update
 * Example 1.: Add button is clicked once with 1 as input. Test lifetime count values are: [0, 1]
 * Example 2.: Button click order: add, add, subtract, add. Test lifetime count values are: [0, 1, 2, 1, 2]
 * Example 3.: Subtract 1. Update should reject. Values are: [0, -1]
 */
function setCounterServiceReturnValues(values: number[]) {
  if (values === null || values.length === 0) {
    throw new Error('Values can not be empty or null!')
  }
  let productUserCount: ProductUserCount = {
    productID: 1,
    purchaseCount: values[0],
    recycleCount: 0,
    userID: 1
  }
  counterServiceMock.getProductUserCounts.mockResolvedValueOnce(productUserCount)
  for (let i = 1; i < values.length; i++) {
    if (values[i] < 0) {
      productUserCount.purchaseCount = values[i - 1]
    } else {
      productUserCount.purchaseCount = values[i]
    }
    let addResponseData: PostRequestResponse = {
      message: 'Lisäys onnistui!',
      resource: productUserCount,
      error: undefined
    }
    counterServiceMock.getProductUserCounts.mockResolvedValueOnce(productUserCount)
    if (values[i] < 0) {
      let errorResponse: ErrorResponse = {
        error: 'ValidationError',
        message: 'Ei voi olla negatiivinen',
        validationErrorObject: undefined
      }
      counterServiceMock.updateProductUserCount.mockRejectedValueOnce(errorResponse)
    } else {
      counterServiceMock.updateProductUserCount.mockResolvedValueOnce(addResponseData)
    }
  }

  let addResponseData: PostRequestResponse = {
    message: 'Lisäys onnistui!',
    resource: productUserCount,
    error: undefined
  }
  counterServiceMock.updateProductUserCount.mockResolvedValueOnce(addResponseData)
  counterServiceMock.getProductUserCounts.mockResolvedValue(productUserCount)
}

const product: Product = {
  id: 1,
  name: 'Juustoportti suklaamaito',
  instructions: [],
  creator: 1,
  productImage: ''
}

describe('When ProductUserCountForm is rendered', () => {

  afterEach(() => {
    jest.clearAllMocks() // Clear mock return values after each test
  })

  describe('For the first time', () => {
    it('Counts should be 0', async () => {

      setCounterServiceReturnValues([0])

      const component = render(<ProductUserCountForm
        product={product}
        countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
        amountText={'Hankittu'}
        sendUpdateText={'Hanki'}
        subtractUpdateText={'Poista'}
        tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
        tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
        counterService={counterServiceMock}
      />)
      const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

      expect(productuserCountContainer?.textContent).toContain('Hankittu 0 kpl')
    })
  })

  describe('When pressing add button', () => {
    describe('With default input', () => {
      it('should grow the count by 1', async () => {

        setCounterServiceReturnValues([0, 1])

        const component = render(<ProductUserCountForm
          product={product}
          countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
          amountText={'Hankittu'}
          sendUpdateText={'Hanki'}
          subtractUpdateText={'Poista'}
          tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
          tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
          counterService={counterServiceMock}
        />)
        const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

        const addCountButton = component.container.querySelector('[id*="addCountButton"]') // id containing addCountButton
        if (addCountButton !== null) {
          fireEvent.click(addCountButton)
        } else {
          throw new Error('addCountButton not found')
        }

        await waitFor(() => {
          expect(productuserCountContainer?.textContent).toContain('Hankittu 1 kpl')
        })
      })
    })

    describe('With user typed input', () => {
      it('should grow the count by user typed num', async () => {

        setCounterServiceReturnValues([0, 6])

        const component = render(<ProductUserCountForm
          product={product}
          countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
          amountText={'Hankittu'}
          sendUpdateText={'Hanki'}
          subtractUpdateText={'Poista'}
          tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
          tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
          counterService={counterServiceMock}
        />)
        const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

        const countInput = component.container.querySelector('[id*="countInput"]')
        if (countInput !== null) {
          fireEvent.change(countInput, { target: { value: 6 } })
        } else {
          throw new Error('countInput not found')
        }

        const addCountButton = component.container.querySelector('[id*="addCountButton"]')
        if (addCountButton !== null) {
          fireEvent.click(addCountButton)
        } else {
          throw new Error('addCountButton not found')
        }

        await waitFor(() => {
          expect(productuserCountContainer?.textContent).toContain('Hankittu 6 kpl')
        })
      })
    })
  })

  describe('When pressing subtract button', () => {

    describe('When counter is 0', () => {
      it('should not reduce the count', async () => {

        setCounterServiceReturnValues([0, -1])

        const component = render(<ProductUserCountForm
          product={product}
          countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
          amountText={'Hankittu'}
          sendUpdateText={'Hanki'}
          subtractUpdateText={'Poista'}
          tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
          tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
          counterService={counterServiceMock}
        />)
        const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

        const subtractCountButton = component.container.querySelector('[id*="subtractCountButton"]')
        if (subtractCountButton !== null) {
          fireEvent.click(subtractCountButton)
        } else {
          throw new Error('subtractCountButton not found')
        }

        await waitFor(() => {
          expect(productuserCountContainer?.textContent).toContain('Hankittu 0 kpl')
        })
      })
    })

    describe('When counter is > 0', () => {
      it('should reduce the count', async () => {

        setCounterServiceReturnValues([0, 1, 2, 1])

        const component = render(<ProductUserCountForm
          product={product}
          countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
          amountText={'Hankittu'}
          sendUpdateText={'Hanki'}
          subtractUpdateText={'Poista'}
          tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
          tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
          counterService={counterServiceMock}
        />)
        const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

        const addCountButton = component.container.querySelector('[id*="addCountButton"]')
        if (addCountButton !== null) {
          fireEvent.click(addCountButton)
          fireEvent.click(addCountButton)
        } else {
          throw new Error('addCountButton not found')
        }

        const subtractCountButton = component.container.querySelector('[id*="subtractCountButton"]')
        if (subtractCountButton !== null) {
          fireEvent.click(subtractCountButton)
        } else {
          throw new Error('subtractCountButton not found')
        }

        await waitFor(() => {
          expect(productuserCountContainer?.textContent).toContain('Hankittu 1 kpl')
        })
      })

      describe('When trying to subtract more than counted', () => {
        it('should not change the count', async () => {

          setCounterServiceReturnValues([0, 1, 2, 3, -1])

          const component = render(<ProductUserCountForm
            product={product}
            countType={PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
            amountText={'Hankittu'}
            sendUpdateText={'Hanki'}
            subtractUpdateText={'Poista'}
            tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
            tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
            counterService={counterServiceMock}
          />)
          const productuserCountContainer = component.container.querySelector('#productUserCountContainer')

          const addCountButton = component.container.querySelector('[id*="addCountButton"]')
          if (addCountButton !== null) {
            fireEvent.click(addCountButton)
            fireEvent.click(addCountButton)
            fireEvent.click(addCountButton)
          } else {
            throw new Error('addCountButton not found')
          }

          const countInput = component.container.querySelector('[id*="countInput"]')
          if (countInput !== null) {
            fireEvent.change(countInput, { target: { value: 4 } })
          } else {
            throw new Error('countInput not found')
          }

          const subtractCountButton = component.container.querySelector('[id*="subtractCountButton"]')
          if (subtractCountButton !== null) {
            fireEvent.click(subtractCountButton)
          } else {
            throw new Error('subtractCountButton not found')
          }

          await waitFor(() => {
            expect(productuserCountContainer?.textContent).toContain('Hankittu 3 kpl')
          })
        })
      })
    })

  })

})