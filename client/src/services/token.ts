let token: string | null = null
const getConfig = () => ({
  headers: { Authorization: token },
})

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`
}

const removeToken = () => {
  token = null
}

export default { getConfig, setToken, removeToken }