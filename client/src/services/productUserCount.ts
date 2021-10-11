import axios from 'axios'
import { PostRequestResponse } from '../types/messages'
import { ProductUserCount, ProductUserCountUpdate } from '../types/objects'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/count/product/user`

export enum PRODUCT_USER_COUNT_REQUEST_TYPE {
  PURCHASE = 'purchaseCount',
  RECYCLE = 'recycleCount'
}

const updateCount = async (updateObject: ProductUserCountUpdate) => {
  const response = await axios.post(baseUrl, updateObject, tokenService.getConfig())
  return response.data
}

const getProductUserCounts = async (productID: number) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { productID }
  }
  const request = await axios.get(baseUrl, config)
  return request.data
}

export type ProductUserCountService = {
  updateCount: (updateObject: ProductUserCountUpdate) => Promise<PostRequestResponse>,
  getProductUserCounts: (productID: number) => Promise<ProductUserCount>
}

const productUserCountService: ProductUserCountService = { updateCount, getProductUserCounts }

export default productUserCountService