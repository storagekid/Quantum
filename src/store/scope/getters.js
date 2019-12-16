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

export function clinicsByScope (state) {
  if (!state.clinic.clinics.items.length || !state.setted) return null
  else {
    let modelsByScope = {}
    for (let item of state.clinic.clinics.items) {
      if (!modelsByScope[item.county.state.country_id]) modelsByScope[item.county.state.country_id] = {}
      if (!modelsByScope[item.county.state.country_id][item.county.state_id]) modelsByScope[item.county.state.country_id][item.county.state_id] = {}
      if (!modelsByScope[item.county.state.country_id][item.county.state_id][item.county_id]) modelsByScope[item.county.state.country_id][item.county.state_id][item.county_id] = []
      modelsByScope[item.county.state.country_id][item.county.state_id][item.county_id].push(item)
    }
    return modelsByScope
  }
}
