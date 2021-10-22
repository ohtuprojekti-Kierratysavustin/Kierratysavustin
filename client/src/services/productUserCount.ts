import axios from 'axios'
import { PostRequestResponse } from '../types/messages'
import { ProductUserCount, ProductUserCountUpdate } from '../types/objects'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/count`

export enum PRODUCT_USER_COUNT_REQUEST_TYPE {
  PURCHASE = 'purchaseCount',
  RECYCLE = 'recycleCount'
}

const updateCount = async (updateObject: ProductUserCountUpdate): Promise<PostRequestResponse> => {
  const response = axios.post(`${baseUrl}/product/user`, updateObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getProductUserCounts = async (productID: number) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { productID }
  }
  const response = axios.get(`${baseUrl}/product/user`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getUserCounts = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${process.env.PUBLIC_URL}/api/statistics`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getGraphStatistics = async (numOfDays: number) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { numOfDays }
  }
  console.log(config)
  const response = axios.get(`${process.env.PUBLIC_URL}/api/statistics/user/table`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type ProductUserCountService = {
  updateCount: (updateObject: ProductUserCountUpdate) => Promise<PostRequestResponse>,
  getProductUserCounts: (productID: number) => Promise<ProductUserCount>,
  getUserCounts: () => Promise<any>,
  getGraphStatistics: (numOfDays: number) => Promise<number[]>
}

export const productUserCountService: ProductUserCountService = { updateCount, getProductUserCounts, getUserCounts, getGraphStatistics }