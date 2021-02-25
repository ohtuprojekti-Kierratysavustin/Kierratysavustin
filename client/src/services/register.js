import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/users`





const createUser = async (newUser) => {
  const response = axios.post(`${baseUrl}`, newUser)
  return response
}

export default{ createUser }