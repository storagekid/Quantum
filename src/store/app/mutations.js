import { LocalStorage } from 'quasar'

export function ClearCachePages (state) {
  state.cache.pages = []
}
export function setSetting (state, { name, value, persists = false }) {
  state.settings[name] = value
  LocalStorage.set('settings', state.settings)
  // localStorage.setItem('settings', JSON.stringify(state.settings))
}
export function setSettingsFromStorage (state, settings) {
  // console.log(settings)
  if (typeof settings === 'string') settings = JSON.parse(settings)
  state.settings = settings
  // console.log('Current Lang: ' + this.$i18n.locale)
  // if (state.settings.lang) this.$i18n.locale = state.settings.lang
  // console.log('New Lang: ' + this.$i18n.locale)
}
export function setMenus (state, menus) {
  state.menus = menus
  LocalStorage.set('menus', state.menus)
  // localStorage.setItem('menus', JSON.stringify(state.menus))
}
export function setRoutes (state, routes) {
  state.routes = routes
  LocalStorage.set('routes', state.routes)
  // localStorage.setItem('routes', JSON.stringify(state.routes))
}
