export function ClearCachePages (state) {
  state.cache.pages = []
}
export function setSetting (state, { name, value, persists = false }) {
  state.settings[name] = value
  localStorage.setItem('settings', JSON.stringify(state.settings))
}
export function setSettingsFromStorage (state, settings) {
  state.settings = settings
  // console.log('Current Lang: ' + this.$i18n.locale)
  // if (state.settings.lang) this.$i18n.locale = state.settings.lang
  // console.log('New Lang: ' + this.$i18n.locale)
}
export function setMenus (state, menus) {
  state.menus = menus
  localStorage.setItem('menus', JSON.stringify(state.menus))
}
export function setRoutes (state, routes) {
  state.routes = routes
  localStorage.setItem('routes', JSON.stringify(state.routes))
}
