import axios from 'axios'

const baseUrl = `${process.env.PUBLIC_URL}/api/products`

const create = async newObject => {
  const response = axios.post(baseUrl, newObject)
  return response
}
const createInstruction = async (id, newObject) => {
  const response = axios.post(`${baseUrl}/${id}/instructions`, newObject)
  return response
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
export default { create, getAll,createInstruction }