export function scopeText (state, getters, rootState) {
  if (state.clinic.clinics.selected.length === 1) {
    return getters.clinicSelected.nickname
    // let clinic = rootState.Model.models.clinics.items.filter(clinic => { return clinic.id === state.clinic.clinics.selected[0] })[0]
    // return clinic.nickname
  } else {
    return state.clinic.clinics.selected.length + ' Clínicas'
  }
}
export function scopeStoreText (state, getters, rootState) {
  if (state.store.stores.selected.length === 1) {
    return getters.storeSelected.name
    // let store = rootState.Model.models.stores.items.filter(store => { return store.id === state.store.stores.selected[0] })[0]
    // return store.name
  } else {
    return state.store.stores.selected.length + ' Locales'
  }
}
export function clinicSelected (state, getters, rootState) {
  if (state.clinic.clinics.selected.length === 1) {
    let clinic = rootState.Model.models.clinics.items.filter(clinic => { return clinic.id === state.clinic.clinics.selected[0] })[0]
    return clinic
  }
}
export function storeSelected (state, getters, rootState) {
  if (state.store.stores.selected.length === 1) {
    let store = rootState.Model.models.stores.items.filter(store => { return store.id === state.store.stores.selected[0] })[0]
    return store
  }
}
