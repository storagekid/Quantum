export function initScope (state, { storeIds, clinicIds, countyIds, stateIds, countryIds }) {
  state.clinic.clinics.ids = clinicIds
  state.clinic.counties.ids = countyIds
  state.clinic.states.ids = stateIds
  state.clinic.countries.ids = countryIds
  state.store.stores.ids = storeIds
  // Object.keys(profile.clinicScope).map((k) => {
  //   state.clinic.clinics.ids.push(profile.clinicScope[k].id)
  //   if (!state.clinic.counties.ids.includes(profile.clinicScope[k].county.id)) {
  //     state.clinic.counties.items.push(profile.clinicScope[k].county)
  //     state.clinic.counties.ids.push(profile.clinicScope[k].county.id)
  //   }
  //   if (!state.clinic.states.ids.includes(profile.clinicScope[k].county.state_id)) {
  //     state.clinic.states.items.push(profile.clinicScope[k].county.state)
  //     state.clinic.states.ids.push(profile.clinicScope[k].county.state_id)
  //   }
  //   if (!state.clinic.countries.ids.includes(profile.clinicScope[k].county.state.country_id)) {
  //     state.clinic.countries.items.push(profile.clinicScope[k].county.state.country)
  //     state.clinic.countries.ids.push(profile.clinicScope[k].county.state.country_id)
  //   }
  // })
  // state.clinic.counties.items = Object.keys(profile.clinicScope).map((k) => { return profile.county })
  // state.clinic.counties.ids = profile.countyIdsScope
  // state.clinic.states.items = profile.stateScope
  // state.clinic.states.ids = profile.stateIdsScope
  // state.clinic.countries.items = profile.countryScope
  // state.clinic.countries.ids = profile.countryIdsScope
  // state.store.stores.items = profile.storeScope
  // state.store.stores.ids = profile.storeIdsScope
  // state.store.countries.items = profile.countryStoreScope
  // state.store.countries.ids = profile.countryIdsStoreScope
  // if (state.clinic.clinics.items.length === 1) {
  //   state.clinic.clinics.selected = state.clinic.clinics.ids
  //   state.clinic.counties.selected = state.clinic.counties.ids
  //   state.clinic.countries.selected = state.clinic.countries.ids
  //   state.clinic.states.selected = state.clinic.states.ids
  // }
  // if (state.store.stores.items.length === 1) {
  //   state.store.stores.selected = state.store.stores.ids
  // }
}
export function setScope (state, scope) {
  if (state.mode === 'clinic') {
    state.clinic.clinics.selected = scope.clinics.length ? scope.clinics : state.clinic.clinics.ids
    state.clinic.counties.selected = scope.counties.length ? scope.counties : state.clinic.counties.ids
    state.clinic.countries.selected = scope.countries.length ? scope.countries : state.clinic.countries.ids
    state.clinic.states.selected = scope.states.length ? scope.states : state.clinic.states.ids
  } else {
    state.store.stores.selected = scope.stores.length ? scope.stores : state.store.stores.ids
    state.store.countries.selected = scope.countries.length ? scope.countries : state.store.countries.ids
  }
  state.setted = true
  localStorage.setItem('scope', JSON.stringify(state))
}
export function setScopeMode (state, mode) {
  state.mode = mode
  localStorage.setItem('scope', JSON.stringify(state))
}
export function clearScope (state) {
  state.clinic = {
    clinics: { ids: [], items: [], selected: [] },
    counties: { ids: [], items: [], selected: [] },
    countries: { ids: [], items: [], selected: [] },
    states: { ids: [], items: [], selected: [] }
  }
  state.store = {
    stores: { ids: [], items: [], selected: [] },
    countries: { ids: [], items: [], selected: [] }
  }
  state.mode = null
  state.setted = false
}
export function setScopeFromStorage (state, scope) {
  state.clinic.clinics = scope.clinic.clinics
  state.clinic.counties = scope.clinic.counties
  state.clinic.countries = scope.clinic.countries
  state.clinic.states = scope.clinic.states
  state.store.stores = scope.store.stores
  state.store.countries = scope.store.countries
  state.mode = scope.mode
  state.setted = true
}
// export function updateScopeItems (state, { name, item }) {
//   for (const [index, model] of state[state.mode][name].items.entries()) {
//     if (model.id === item.id) {
//       for (let prop in item) {
//         state[state.mode][name].items[index][prop] = item[prop]
//       }
//     }
//   }
// }
