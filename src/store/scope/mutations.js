export function initScope (state, { storeIds, clinicIds, countyIds, stateIds, countryIds }) {
  state.clinic.clinics.ids = clinicIds
  state.clinic.counties.ids = countyIds
  state.clinic.states.ids = stateIds
  state.clinic.countries.ids = countryIds
  state.store.stores.ids = storeIds
}
export function setScope (state, scope) {
  // console.log('setScope')
  // console.log(scope)
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
