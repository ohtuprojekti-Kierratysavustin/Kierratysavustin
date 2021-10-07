import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/count`

const REQUEST_TYPE = { PURCHASE: 'purchase',
  RECYCLE: 'recycle'
}

const updateCount = async (newObject: { productID: number, amount: number, type: String }) => {
  const response = await axios.post(`${baseUrl}/product/user`, newObject, tokenService.getConfig())
  return response.data
}

const getProductUserCounts = async (params: { productID: number }) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: params
  }
  const request = await axios.get(`${baseUrl}/product/user`, config)
  return request.data
}

const getUserCounts = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const request = await axios.get(`${baseUrl}/stats`, config)
  return request.data
}


export default { updateCount, getProductUserCounts, getUserCounts, REQUEST_TYPE }