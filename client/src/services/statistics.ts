import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/statistics`

const getUserCumulativeRecyclingRatesPerProduct = async () => {
  let config = {
    headers: tokenService.getConfig().headers
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperproduct`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getUserCumulativeRecyclingRatesPerDay = async ( end: number, days: number, productID: number | undefined ) => {
  let config = {
    headers: tokenService.getConfig().headers,
    params: { end, days, productID }
  }
  const response = axios.get(`${baseUrl}/user/recyclingratesperday`, config)
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export type StatisticsService = {
  getUserCumulativeRecyclingRatesPerProduct: () => Promise<any>,
  getUserCumulativeRecyclingRatesPerDay: (end: number, days: number, product: number | undefined) => Promise<number[]>,
}

export const statisticsService: StatisticsService = { getUserCumulativeRecyclingRatesPerProduct, getUserCumulativeRecyclingRatesPerDay }