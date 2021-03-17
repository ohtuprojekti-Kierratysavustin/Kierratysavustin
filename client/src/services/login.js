import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/login`

const loginUser = async (newUser) => {
  const response = await axios.post(`${baseUrl}`, newUser)
  console.log(response)
  return response
}

export default{ loginUser }