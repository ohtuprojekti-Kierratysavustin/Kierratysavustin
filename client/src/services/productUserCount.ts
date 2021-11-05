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

const getUserCounts = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperproduct`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getGraphStatistics = async ( start: number, end: number ) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { start, end }
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperday`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type ProductUserCountService = {
  updateCount: (updateObject: ProductUserCountUpdate) => Promise<PostRequestResponse>,
  getProductUserCounts: (productID: number) => Promise<ProductUserCount>,
  getUserCounts: () => Promise<any>,
  getGraphStatistics: (start: number, end: number) => Promise<number[]>
}

export const productUserCountService: ProductUserCountService = { updateCount, getProductUserCounts, getUserCounts, getGraphStatistics }