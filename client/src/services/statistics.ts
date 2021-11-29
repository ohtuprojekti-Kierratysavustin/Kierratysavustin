import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/statistics`

const getUserRecyclingRatesPerProduct = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperproduct`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getUserRecyclingRatesPerDay = async ( end: number, days: number, product: number | undefined ) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { end, days, product }
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperday`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type StatisticsService = {
  getUserRecyclingRatesPerProduct: () => Promise<any>,
  getUserRecyclingRatesPerDay: (end: number, days: number, product: number | undefined) => Promise<number[]>,
}

export const statisticsService: StatisticsService = { getUserRecyclingRatesPerProduct, getUserRecyclingRatesPerDay }