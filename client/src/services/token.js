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
export default { getConfig,setToken,removeToken }