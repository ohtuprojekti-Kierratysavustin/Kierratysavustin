import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/recycle`

//TODO Poikkeusten hallinta!?

const recycle = async (newObject: { productID: number, amount: number }) => {
  const response = axios.post(baseUrl, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const getProductRecycleStats = (params: { productID: string }) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: params
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}


export default { recycle, getProductRecycleStats }