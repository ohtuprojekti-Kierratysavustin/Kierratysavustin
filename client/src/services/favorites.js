import axios from 'axios'
const baseUrl = `${process.env.PUBLIC_URL}/api/favorites`

const addFavorite = async (user,product) => {
  const response = await axios.post(`${baseUrl}`, { user,product })
  return response
}
const removeFavorite = async (user,product) => {
  const response = await axios.delete(`${baseUrl}`, user,product)
  return response
}
const getFavorites = async (user) => {
  const response = await axios.get(`${baseUrl}`, user)
  return response
}


export default{ addFavorite,  removeFavorite, getFavorites }