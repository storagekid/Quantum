export function initScope (state, scope) {
  if (state.mode === 'clinic') {
    state.clinic.clinics.items = scope.clinics.length ? scope.clinics : state.clinic.clinics.items
    state.clinic.counties.items = scope.counties.length ? scope.counties : state.clinic.counties.items
    state.clinic.countries.items = scope.countries.length ? scope.countries : state.clinic.countries.items
    state.clinic.states.items = scope.states.length ? scope.states : state.clinic.states.items
  } else {
    state.store.stores.items = scope.stores.length ? scope.stores : state.store.stores.items
    state.store.countries.items = scope.countries.length ? scope.countries : state.store.countries.items
  }
}
export function setScope (state, scope) {
  if (state.mode === 'clinic') {
    state.clinic.clinics.selected = scope.clinics.length ? scope.clinics : state.clinic.clinics.items
    state.clinic.counties.selected = scope.counties.length ? scope.counties : state.clinic.counties.items
    state.clinic.countries.selected = scope.countries.length ? scope.countries : state.clinic.countries.items
    state.clinic.states.selected = scope.states.length ? scope.states : state.clinic.states.items
  } else {
    state.store.stores.selected = scope.stores.length ? scope.stores : state.store.stores.items
    state.store.countries.selected = scope.countries.length ? scope.countries : state.store.countries.items
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
  state.clinic.clinics.selected = scope.clinic.clinics.selected
  state.clinic.counties.selected = scope.clinic.counties.selected
  state.clinic.countries.selected = scope.clinic.countries.selected
  state.clinic.states.selected = scope.clinic.states.selected
  state.store.stores.selected = scope.store.stores.selected
  state.store.countries.selected = scope.store.countries.selected
  state.mode = scope.mode
  state.setted = true
}
