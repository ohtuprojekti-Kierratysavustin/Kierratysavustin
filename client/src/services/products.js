import axios from 'axios'

const baseUrl = `${process.env.PUBLIC_URL}/api/products`

const create = async newObject => {
  const response = axios.post(baseUrl, newObject)
  return response
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const getOne = (id) => {
  const request = axios.get(`baseUrl/${id}`)
  return request.then(response => response.data)
}
export default { create, getAll, getOne }