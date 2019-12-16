export function responseErrorManager ({ commit, dispatch }, response) {
  if (response.data) {
    if (response.data.exception) {
      if (response.status) dispatch('responseStatusPrinter', response)
      else dispatch('Notify/displayMessage', { message: 'Error en el servidor. Por favor contacte con el admimistrador.', position: 'top', type: 'negative' }, { root: true })
      return
    }
    if (response.data.errors) {
      for (let error in response.data.errors) {
        dispatch('Notify/displayMessage', { message: response.data.errors[error][0], position: 'top', type: 'negative' }, { root: true })
      }
    }
    if (response.data.message) {
      dispatch('Notify/displayMessage', { message: response.data.message, position: 'top', type: 'negative' }, { root: true })
    }
  }
  if (!response.status) {
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
      dispatch('Notify/displayMessage', { message: 'No has iniciado sesión', position: 'top', type: 'negative' }, { root: true })
      this.$router.push({ name: 'logout' })
      break
    case 403:
      let message = response.data.message
      if (!message) message = 'Error en el servidor. Por favor contacte con el admimistrador.'
      dispatch('Notify/displayMessage', { message: message, position: 'top', type: 'negative' }, { root: true })
      break
    case 422:
      dispatch('Notify/displayMessage', { message: 'Los datos no han superado las puebas de validación', position: 'top', type: 'negative' }, { root: true })
      break
  }
}
