export function scopeText (state, getters, rootState) {
  if (state.clinic.clinics.selected.length === 1) {
    return getters.clinicSelected.nickname
  } else {
    return state.clinic.clinics.selected.length + ' Clínicas'
  }
}
export function scopeStoreText (state, getters, rootState) {
  if (state.store.stores.selected.length === 1) {
    return getters.storeSelected.name
  } else {
    return state.store.stores.selected.length + ' Locales'
  }
}
export function clinicSelected (state, getters, rootState) {
  if (state.clinic.clinics.selected.length === 1) {
    return state.clinic.clinics.selected[0]
  }
}
export function storeSelected (state, getters, rootState) {
  if (state.store.stores.selected.length === 1) {
    return state.store.stores.selected[0]
  }
}
