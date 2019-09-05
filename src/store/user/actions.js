import axios from 'axios'

export function getUser (context) {
  return new Promise((resolve, reject) => {
    axios.get(context.rootState.App.dataWarehouse + 'user')
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error.response)
      })
  })
}
