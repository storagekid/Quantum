export function started (state, getters, rootState) {
  if (rootState.Auth.auth && rootState.User.setted && rootState.Scope.setted) {
    return true
  }
  return false
}
export function homePage (state, getters, rootState) {
  if (state.settings.home) {
    return state.settings.home
  }
  return state.routes[0]
}
