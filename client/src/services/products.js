import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/products`
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
export default { create, getAll, createInstruction, setToken, removeToken }