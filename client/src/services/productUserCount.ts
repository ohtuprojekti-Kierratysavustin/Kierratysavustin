import axios from 'axios'
import { PostRequestResponse } from '../types/requestResponses'
import { ProductUserCount, ProductUserCountUpdate } from '../types/objects'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/statistics`

export enum PRODUCT_USER_COUNT_REQUEST_TYPE {
  PURCHASE = 'purchaseCount',
  RECYCLE = 'recycleCount'
}

const updateCount = async (updateObject: ProductUserCountUpdate): Promise<PostRequestResponse> => {
  const response = axios.post(`${baseUrl}/user/counts/product/`, updateObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getProductUserCounts = async (productID: number) => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${baseUrl}/user/counts/product/` + productID, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getRecyclingRatesPerProduct = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${baseUrl}/user/recycle/rates/products/`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getRecyclingRatesPerDay = async ( start: number, end: number ) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { start, end }
  }
  const response = axios.get(`${baseUrl}/user/recycle/rates/days/`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type ProductUserCountService = {
  updateCount: (updateObject: ProductUserCountUpdate) => Promise<PostRequestResponse>,
  getProductUserCounts: (productID: number) => Promise<ProductUserCount>,
  getRecyclingRatesPerProduct: () => Promise<any>,
  getRecyclingRatesPerDay: (start: number, end: number) => Promise<number[]>
}

export const productUserCountService: ProductUserCountService = { updateCount, getProductUserCounts, getRecyclingRatesPerProduct, getRecyclingRatesPerDay }