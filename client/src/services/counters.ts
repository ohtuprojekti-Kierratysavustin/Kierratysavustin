import axios from 'axios'
import { PostRequestResponse } from '../types/requestResponses'
import { ProductUserCount, ProductUserCountUpdate } from '../types/objects'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/counters`

export enum PRODUCT_USER_COUNT_REQUEST_TYPE {
  PURCHASE = 'purchaseCount',
  RECYCLE = 'recycleCount'
}

const updateProductUserCount = async (updateObject: ProductUserCountUpdate): Promise<PostRequestResponse> => {
  const response = axios.post(`${baseUrl}/user/product`, updateObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getProductUserCounts = async (productID: number) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { productID }
  }
  const response = axios.get(`${baseUrl}/user/product`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type CounterService = {
  updateProductUserCount: (updateObject: ProductUserCountUpdate) => Promise<PostRequestResponse>,
  getProductUserCounts: (productID: number) => Promise<ProductUserCount>
}

export const counterService: CounterService = { updateProductUserCount, getProductUserCounts }