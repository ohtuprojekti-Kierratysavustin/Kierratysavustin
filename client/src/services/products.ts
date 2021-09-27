import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`


const create = async (newObject: {name: string}) => {
  const response =  axios.post(baseUrl, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const createInstruction = async (id: number, newObject: {information: string}) => {
  const response = axios.post(`${baseUrl}/${id}/instructions`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getFavorites = (id: number) => {
  const request = axios.get(`${baseUrl}/user`, { params: { id } })
  return request.then(response => response.data)
}

const remove = (id: number) => {
  axios.delete(`${baseUrl}/${id}`, tokenService.getConfig())
}


export default { create, getAll, createInstruction , getFavorites, remove, }