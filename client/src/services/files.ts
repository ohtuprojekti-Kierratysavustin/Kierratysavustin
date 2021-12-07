import axios from 'axios'
import tokenService from './token'
const baseUrl = `${process.env.PUBLIC_URL}/api/files`

const addProductImage = (id: number, formData: any) => {
  const token = tokenService.getToken()
  const request = axios.post(`${baseUrl}/upload/product`,
    formData,
    { headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token
    },
    params: { id }
    })
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
  return request
}

export default { addProductImage }