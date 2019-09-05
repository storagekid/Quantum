import Axios from 'axios'

export function setToken (state, token) {
  state.token = token
  Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  Axios.defaults.headers.common['Content-Type'] = 'text/plain'
  state.auth = true
}
export function clearToken (state, token) {
  state.token = null
  // Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  delete Axios.defaults.headers.common['Authorization']
  state.auth = false
}
