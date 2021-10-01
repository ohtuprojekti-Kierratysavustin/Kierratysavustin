import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/recycle`

//TODO Poikkeusten hallinta!?

const recycle = async (newObject: { productID: number, amount: number, type: String }) => {
  const response = await axios.post(baseUrl, newObject, tokenService.getConfig())
  return response.data
}

const getProductStats = async (params: { productID: number, type: String }) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: params
  }
  const request = await axios.get(baseUrl, config)
  return request.data
}


export default { recycle, getProductStats }