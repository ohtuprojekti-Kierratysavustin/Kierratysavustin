import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`


const create = async newObject => {
  const response =  axios.post(baseUrl, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const createInstruction = async (id, newObject) => {
  const response = axios.post(`${baseUrl}/${id}/instructions`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getFavorites = (id) => {
  const request = axios.get(`${baseUrl}/user`, { params: { id } }, tokenService.getConfig())
  return request.then(response => response.data)
}


export default { create, getAll, createInstruction , getFavorites, }