import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/count/product/user`

const REQUEST_TYPE = { PURCHASE: 'purchase',
  RECYCLE: 'recycle'
}

const updateCount = async (newObject: { productID: number, amount: number, type: String }) => {
  const response = await axios.post(baseUrl, newObject, tokenService.getConfig())
  return response.data
}

const getProductUserCounts = async (params: { productID: number }) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: params
  }
  const request = await axios.get(baseUrl, config)
  return request.data
}


export default { updateCount, getProductUserCounts, REQUEST_TYPE }