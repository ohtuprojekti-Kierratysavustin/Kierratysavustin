import axios from 'axios'
import tokenService from './token'
const registerUrl = `${process.env.PUBLIC_URL}/api/users`
const userUrl =  `${process.env.PUBLIC_URL}/api/users`

const createUser = async (newUser) => {
  const response = await axios.post(`${registerUrl}`, newUser)
  return response
}
const loginUrl = `${process.env.PUBLIC_URL}/api/login`

const loginUser = async (newUser) => {
  const response = await axios.post(`${loginUrl}`, newUser)
  return response.data
}
const addFavorite = async (newObject) => {
  const response =  axios.post(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}

const removeFavorite = async (newObject) => {
  const response =  axios.put(`${userUrl}/products/${newObject.id}`, newObject, tokenService.getConfig())
  return response.then(response => response.data)
}
const addLike = async (id) => {
  const response =  axios.post(`${userUrl}/likes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const removeLike = async (id) => {
  const response =  axios.put(`${userUrl}/likes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const addDislike = async (id) => {
  const response =  axios.post(`${userUrl}/dislikes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
const removeDislike = async (id) => {
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
const getVotes = async (id) => {
  const response =  axios.put(`${userUrl}/votes/${id}`, id, tokenService.getConfig())
  return response.then(response => response.data)
}
export default{ createUser ,loginUser ,addFavorite, removeFavorite,
  addDislike, addLike, removeDislike, removeLike, getLikes, getDislikes, getVotes }