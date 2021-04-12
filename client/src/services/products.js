import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`
const userUrl =  `${process.env.PUBLIC_URL}/api/users/products`
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
  const response =  axios.post(`${userUrl}/${newObject.id}`, newObject, getConfig())
  return response.then(response => response.data)
}

const removeFavorite = async (newObject) => {
  const response =  axios.put(`${userUrl}/${newObject.id}`, newObject, getConfig())
  return response.then(response => response.data)
}
export default { create, getAll, createInstruction, setToken, removeToken ,addFavorite, removeFavorite, getFavorites }