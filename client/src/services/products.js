import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`
const userUrl =  `${process.env.PUBLIC_URL}/api/users`
let token = null

const getConfig = () => ({
  headers: { Authorization: token }
})

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const removeToken = () => {
  token = null
}

const create = async newObject => {
  const response =  axios.post(baseUrl, newObject, getConfig())
  return response.then(response => response.data)
}

const createInstruction = async (id, newObject) => {
  const response = axios.post(`${baseUrl}/${id}/instructions`, newObject, getConfig())
  return response.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getFavorites = (id) => {
  const request = axios.get(`${baseUrl}/user`, { params: { id } }, getConfig())
  return request.then(response => response.data)
}

const addFavorite = async (newObject) => {
  const response =  axios.post(`${userUrl}/products/${newObject.id}`, newObject, getConfig())
  return response.then(response => response.data)
}

const removeFavorite = async (newObject) => {
  const response =  axios.put(`${userUrl}/products/${newObject.id}`, newObject, getConfig())
  return response.then(response => response.data)
}
const addLike = async (id) => {
  const response =  axios.post(`${userUrl}/likes/${id}`, id, getConfig())
  return response.then(response => response.data)
}
const removeLike = async (id) => {
  const response =  axios.put(`${userUrl}/likes/${id}`, id, getConfig())
  return response.then(response => response.data)
}
const addDislike = async (id) => {
  const response =  axios.post(`${userUrl}/dislikes/${id}`, id, getConfig())
  return response.then(response => response.data)
}
const removeDislike = async (id) => {
  const response =  axios.put(`${userUrl}/dislikes/${id}`, id, getConfig())
  return response.then(response => response.data)
}
const getLikes = async () => {
  const response =  axios.get(`${userUrl}/likes`,  getConfig())
  return response.then(response => response.data)
}
const getDislikes = async () => {
  const response =  axios.get(`${userUrl}/dislikes`,  getConfig())
  return response.then(response => response.data)
}
const getVotes = async (id) => {
  const response =  axios.put(`${userUrl}/votes/${id}`, id, getConfig())
  return response.then(response => response.data)
}
export default { create, getAll, createInstruction, setToken, removeToken ,addFavorite, removeFavorite, getFavorites,
  addDislike, addLike, removeDislike, removeLike, getLikes, getDislikes, getVotes }