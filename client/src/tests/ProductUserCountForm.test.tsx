// TODO korjaa

// import React from 'react'
// import '@testing-library/jest-dom/extend-expect'
// import { render, fireEvent, screen } from '@testing-library/react'
// import ProductUserCountForm from '../components/ProductUserCountForm'
// import { Product, ProductUserCount, ProductUserCountUpdate, User } from '../types/objects'
// import { ProductUserCountService, PRODUCT_USER_COUNT_REQUEST_TYPE as COUNT_PRODUCT_USER_COUNT_REQUEST_TYPE } from '../services/productUserCount'
// import { PostRequestResponse } from '../types/messages'


// const product: Product = {
//   id: 1,
//   name: 'Juustoportti suklaamaito',
//   instructions: [],
//   users: [],
//   user: 1
// }



// const productUserCountServiceMock: ProductUserCountService = (() => {

//   let count = 0;

//   return {
//     getProductUserCounts: async (productID: number) => {
//       return new Promise<ProductUserCount>((resolve, reject) => {
//         if (productID === 1) {
//           let ret: ProductUserCount = {
//             recycleCount: count,
//             purchaseCount: count,
//             userID: 1,
//             productID: 1
//           }
//           resolve(ret)
//         } else {
//           reject({
//             response: {
//               data: {
//                 error: 'Tuotetta ei löytynyt',
//                 validationErrorObject: undefined,
//                 message: 'Tuotetta ei löytynyt'
//               }
//             }
//           })
//         }
//       })
//     },
//     updateCount: async (updateObject: ProductUserCountUpdate) => {
//       return new Promise<PostRequestResponse>((resolve, reject) => {

//         if (updateObject.productID !== 1) {
//           let error =
//             reject({
//               response: {
//                 data: {
//                   error: 'Tuotetta ei löytynyt',
//                   validationErrorObject: undefined,
//                   message: 'Tuotetta ei löytynyt'
//                 }
//               }
//             })
//         }

//         let newCount = count + updateObject.amount

//         if (newCount >= 0) {
//           count = newCount

//           let ret: PostRequestResponse = {
//             error: undefined,
//             message: "Onnistui",
//             resource: {
//               recycleCount: count,
//               purchaseCount: count + updateObject.amount,
//               userID: 1,
//               productID: count
//             }
//           }
//           return resolve(ret)
//         } else {
//           reject({
//             response: {
//               data: {
//                 error: 'Hankittujen määrä ei voi olla pienempi kuin 0!',
//                 validationErrorObject: undefined,
//                 message: 'Hankittujen määrä ei voi olla pienempi kuin 0!'
//               }
//             }
//           })
//         }


//       })
//     }
//   }
// })()

// describe('When pressing add button with default input', () => {
//   it('should grow the count', () => {
//     const component = render(<ProductUserCountForm
//       product={product}
//       countType={COUNT_PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
//       amountText={'Hankittu'}
//       sendUpdateText={'Hanki'}
//       subtractUpdateText={'Poista'}
//       tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
//       tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
//       productUserCountService={productUserCountServiceMock}
//     />)
//     const addCountButton = component.container.querySelector('#addCountButton')
//     const productuserCountContainer = component.container.querySelector('#productUserCountContainer')
//     if (addCountButton !== null) {
//       fireEvent.click(addCountButton)
//     }
//     component.debug()
//     expect(productuserCountContainer?.textContent?.includes('Hankittu 1 kpl'))
//   })
// })

// describe('When pressing subtract button with default', () => {
//   it('should reduce the count', () => {
//     const component = render(<ProductUserCountForm
//       product={product}
//       countType={COUNT_PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
//       amountText={'Hankittu'}
//       sendUpdateText={'Hanki'}
//       subtractUpdateText={'Poista'}
//       tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
//       tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
//       productUserCountService={productUserCountServiceMock}
//     />)
//     const addCountButton = component.container.querySelector('#addCountButton')
//     const subtractCountButton = component.container.querySelector('#subtractCountButton')
//     const productuserCountContainer = component.container.querySelector('#productUserCountContainer')
//     if (addCountButton !== null) {
//       fireEvent.click(addCountButton)
//     }
//     if (subtractCountButton !== null) {
//       fireEvent.click(subtractCountButton)
//     }
//     expect(productuserCountContainer?.textContent?.includes('Hankittu 0 kpl'))
//   })
//   it('should not reduce the recycle count if the current count is 0', () => {
//     const component = render(<ProductUserCountForm
//       product={product}
//       countType={COUNT_PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE}
//       amountText={'Hankittu'}
//       sendUpdateText={'Hanki'}
//       subtractUpdateText={'Poista'}
//       tooltipAdd={'Kasvata tuotteen hankintatilastoa.'}
//       tooltipDelete={'Vähennä tuotteen hankintatilastoa.'}
//       productUserCountService={productUserCountServiceMock}
//     />)
//     const subtractCountButton = component.container.querySelector('#subtractCountButton')
//     const productuserCountContainer = component.container.querySelector('#votes')
//     if (subtractCountButton !== null) {
//       fireEvent.click(subtractCountButton)
//     }
//     expect(productuserCountContainer?.textContent?.includes('Hankittu 0 kpl'))
//   })
// })

