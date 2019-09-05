export function bootApp (context) {
  if (localStorage.settings) context.commit('App/setSettingsFromStorage', JSON.parse(localStorage.settings), { root: true })
  if (localStorage.token && localStorage.user && localStorage.scope && localStorage.menus && localStorage.routes) {
    context.commit('Auth/setToken', localStorage.token, { root: true })
    context.commit('setMenus', JSON.parse(localStorage.menus))
    context.commit('setRoutes', JSON.parse(localStorage.routes))
    let user = JSON.parse(localStorage.user)
    let profile = user.profile

    let counties = []
    let countyIds = []
    let states = []
    let stateIds = []
    let countries = []
    let countryIds = []
    let clinicIds = []
    let storeIds = []
    if (profile.clinicScope.length) {
      Object.keys(profile.clinicScope).map((k) => {
        clinicIds.push(profile.clinicScope[k].id)
        if (!countyIds.includes(profile.clinicScope[k].county.id)) {
          counties.push(profile.clinicScope[k].county)
          countyIds.push(profile.clinicScope[k].county.id)
        }
        if (!stateIds.includes(profile.clinicScope[k].county.state_id)) {
          states.push(profile.clinicScope[k].county.state)
          stateIds.push(profile.clinicScope[k].county.state_id)
        }
        if (!countryIds.includes(profile.clinicScope[k].county.state.country_id)) {
          countries.push(profile.clinicScope[k].county.state.country)
          countryIds.push(profile.clinicScope[k].county.state.country_id)
        }
      })
      context.commit('Model/setModel', { name: 'clinics', options: {} }, { root: true })
      context.commit('Model/setModelItems', { name: 'clinics', items: profile.clinicScope }, { root: true })
    }
    if (profile.storeScope.length) {
      Object.keys(profile.storeScope).map((k) => {
        storeIds.push(profile.storeScope[k].id)
        // if (!countyIds.includes(profile.storeScope[k].county.id)) {
        //   counties.push(profile.storeScope[k].county)
        //   countyIds.push(profile.storeScope[k].county.id)
        // }
        // if (!stateIds.includes(profile.storeScope[k].county.state_id)) {
        //   states.push(profile.storeScope[k].county.state)
        //   stateIds.push(profile.storeScope[k].county.state_id)
        // }
        if (!countryIds.includes(profile.storeScope[k].country_id)) {
          countries.push(profile.storeScope[k].country)
          countryIds.push(profile.storeScope[k].country_id)
        }
      })
      context.commit('Model/setModel', { name: 'stores', options: {} }, { root: true })
      context.commit('Model/setModelItems', { name: 'stores', items: profile.storeScope }, { root: true })
    }
    context.commit('Model/setModel', { name: 'counties', options: {} }, { root: true })
    context.commit('Model/setModelItems', { name: 'counties', items: counties }, { root: true })
    context.commit('Model/setModel', { name: 'states', options: {} }, { root: true })
    context.commit('Model/setModelItems', { name: 'states', items: states }, { root: true })
    context.commit('Model/setModel', { name: 'countries', options: {} }, { root: true })
    context.commit('Model/setModelItems', { name: 'countries', items: countries }, { root: true })

    context.commit('User/setUser', JSON.parse(localStorage.user), { root: true })
    context.commit('Scope/setScopeFromStorage', JSON.parse(localStorage.scope), { root: true })
    // context.dispatch('User/getUser', null, {root: true})
  } else {
    context.dispatch('Auth/logOut', {}, { root: true })
    this.$router.push({ name: 'login' }).catch(err => { console.log(err) })
  }
}
export function resetState (context) {
  context.commit('Scope/clearScope', null, { root: true })
}
