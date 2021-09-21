import axios from 'axios'
import { Product, User } from '../types'
import tokenService from './token'
const registerUrl = `${process.env.PUBLIC_URL}/api/users`
const userUrl =  `${process.env.PUBLIC_URL}/api/users`

const createUser = async (newUser: {
  username: string;
  password: string;
}
) => {
  const response = await axios.post(`${registerUrl}`, newUser)
  return response
}
const loginUrl = `${process.env.PUBLIC_URL}/api/login`

const loginUser = async (newUser: {
  username: string;
  password: string;
}
) => {
  const response = await axios.post<User>(`${loginUrl}`, newUser)
  return response.data
}
const addFavorite = async (newObject: Product) => {
  const response =  axios.post(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const removeFavorite = async (newObject: Product) => {
  const response =  axios.put(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}
const addLike = async (id: number) => {
  const response =  axios.post(`${userUrl}/likes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const removeLike = async (id: number) => {
  const response =  axios.put(`${userUrl}/likes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const addDislike = async (id: number) => {
  const response =  axios.post(`${userUrl}/dislikes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const removeDislike = async (id: number) => {
  const response =  axios.put(`${userUrl}/dislikes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const getLikes = async () => {
  const response =  axios.get(`${userUrl}/likes`,  tokenService.getConfig())
  return response.then(response => response.data)
}
const getDislikes = async () => {
  const response =  axios.get(`${userUrl}/dislikes`,  tokenService.getConfig())
  return response.then(response => response.data)
}

export default{ createUser ,loginUser ,addFavorite, removeFavorite,
  addDislike, addLike, removeDislike, removeLike, getLikes, getDislikes }