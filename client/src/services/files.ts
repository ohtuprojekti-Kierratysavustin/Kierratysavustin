import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/files`

const addProductImage = (id: number, formData: any) => {
  const request = axios.post(`${baseUrl}/upload/product`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' },
      params: { id } })
    .then(response => response.data)
    .catch(error => Promise.reject(error.response.data))
  return request
}

export default { addProductImage }