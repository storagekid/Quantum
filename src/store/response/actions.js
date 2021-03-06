export function responseErrorManager ({ commit, dispatch }, response) {
  // console.log('Hrer')
  // console.log(response)
  // if (typeof response === 'string') dispatch('Notify/displayMessage', { message: response, position: 'top', type: 'negative' }, { root: true })
  if (!response) dispatch('responseNoResponse')
  else if (response.status) dispatch('responseStatusPrinter', response)
  else if (response.data) {
    if (response.data.exception) {
      if (response.status) dispatch('responseStatusPrinter', response)
      else dispatch('Notify/displayMessage', { message: 'Error en el servidor. Por favor contacte con el admimistrador.', position: 'top', type: 'negative' }, { root: true })
    } else if (response.data.errors) {
      for (let error in response.data.errors) {
        dispatch('Notify/displayMessage', { message: response.data.errors[error][0], position: 'top', type: 'negative' }, { root: true })
      }
    } else if (response.data.message) {
      dispatch('Notify/displayMessage', { message: response.data.message, position: 'top', type: 'negative' }, { root: true })
    } else if (typeof response.data === 'string') dispatch('Notify/displayMessage', { message: response.data, position: 'top', type: 'negative' }, { root: true })
  } else if (response.message) {
    dispatch('Notify/displayMessage', { message: response.message, position: 'top', type: 'negative' }, { root: true })
  } else if (!response.status) {
    dispatch('Notify/displayMessage', { message: 'Estamos en mantenimiento. Disculpe las molestias', position: 'top', type: 'negative' }, { root: true })
  } else {
    dispatch('responseStatusPrinter', response)
  }
}
export function responseNoResponse ({ commit, dispatch }) {
  dispatch('Notify/displayMessage', { message: 'Estamos en mantenimiento. Disculpe las molestias', position: 'top', type: 'negative' }, { root: true })
}
export function responseStatusPrinter ({ commit, dispatch }, response) {
  switch (response.status) {
    case 401:
      dispatch('Notify/displayMessage', { message: 'No has iniciado sesi??n', position: 'top', type: 'negative' }, { root: true })
      this.$router.push({ name: 'logout' })
      break
    case 403:
      let message = response.data.message
      if (!message) message = 'Error en el servidor. Por favor contacte con el admimistrador.'
      dispatch('Notify/displayMessage', { message: message, position: 'top', type: 'negative' }, { root: true })
      break
    case 422:
      dispatch('Notify/displayMessage', { message: 'Los datos no han superado las puebas de validaci??n', position: 'top', type: 'negative' }, { root: true })
      break
  }
}
