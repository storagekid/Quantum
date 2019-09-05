export function responseErrorManager ({ commit, dispatch }, response) {
  if (response.data.exception) {
    dispatch('Notify/displayMessage', { message: 'Error en el servidor. Por favor contacte con el admimistrador.', position: 'top', type: 'negative' }, { root: true })
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
  if (!response.status) {
    dispatch('Notify/displayMessage', { message: 'Estamos en mantenimiento. Disculpe las molestias', position: 'top', type: 'negative' }, { root: true })
  } else {
    switch (response.status) {
      case 401:
        dispatch('Notify/displayMessage', { message: 'No has iniciado sesión', position: 'top', type: 'negative' }, { root: true })
        this.$router.push({ name: 'logout' })
        break
      case 403:
        dispatch('Notify/displayMessage', { message: 'Usuario o contraseña incorrectos', position: 'top', type: 'negative' }, { root: true })
        break
      case 422:
        dispatch('Notify/displayMessage', { message: 'Los datos no han superado las puebas de validación', position: 'top', type: 'negative' }, { root: true })
        break
    }
  }
  // if (response.status === 422) {
  //   dispatch('Notify/displayMessage', {message: 'Los datos no han superado las puebas de validación', position: 'top', type: 'negative'}, {root: true})
  // } else if (response.status === 403) {
  //   dispatch('Notify/displayMessage', {message: 'Usuario o contraseña incorrectos', position: 'top', type: 'negative'}, {root: true})
  // } else {
  //   console.log(response)
  // }
}
export function responseNoResponse ({ commit, dispatch }) {
  dispatch('Notify/displayMessage', { message: 'Estamos en mantenimiento. Disculpe las molestias', position: 'top', type: 'negative' }, { root: true })
}
