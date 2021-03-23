import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/login`

const loginUser = async (newUser) => {
  const response = await axios.post(`${baseUrl}`, newUser)
  return response.data
}

export default{ loginUser }