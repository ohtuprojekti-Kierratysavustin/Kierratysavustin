import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`


const create = async (newObject: { name: string }) => {
  const response = axios.post(baseUrl, newObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const createInstruction = async (id: number, newObject: { information: string }) => {
  const response = axios.post(`${baseUrl}/${id}/instructions`, newObject, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const deleteInstruction = async (productId: number, instructionId: number) => {
  const response = axios.delete(`${baseUrl}/${productId}/instructions/${instructionId}`, tokenService.getConfig())
  return response
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const getFavorites = () => {
  let config = {
    headers: tokenService.getConfig().headers
  }

  const request = axios.get(`${baseUrl}/favorites`, config)
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

const remove = (id: number) => {
  const request = axios.delete(`${baseUrl}/${id}`, tokenService.getConfig())
  return request
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
}

export default { create, getAll, createInstruction, deleteInstruction, remove, getFavorites }
