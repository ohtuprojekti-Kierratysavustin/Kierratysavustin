import { AxiosRequestConfig } from 'axios'

let token: string = ''
const getConfig = (): AxiosRequestConfig => ({
  headers: { Authorization: token },
})

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`
}

const removeToken = () => {
  token = ''
}

const getToken = (): string => {
  return token
}

export default { getConfig, setToken, removeToken, getToken }