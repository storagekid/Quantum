export function setUser (state, user) {
  state.name = user.name
  state.groups = user.groups
  state.group_users = user.group_users
  state.groupsInfo = user.groupsInfo
  state.permissions = user.permissions
  state.profile = user.profile
  state.setted = true
  localStorage.setItem('user', JSON.stringify(state))
}
export function clearUser (state) {
  state.name = null
  state.groups = null
  state.groupsInfo = null
  state.permissions = {}
  state.profile = null
  state.setted = false
}
export function setUserFromStorage (state, user) {
  state.name = user.name
  state.groups = user.groups
  state.groupsInfo = user.groupsInfo
  state.permissions = user.permissions
  state.profile = user.profile
  state.setted = true
}
