<template>
  <q-page padding class="">
    <div class="fullscreen row justify-center items-center">
      <div class="col-xs-10 col-sm-8 col-md-6 col-lg-4 col-xl-4">
        <transition-group
          appear
          enter-active-class="animated bounceInLeft"
          leave-active-class="animated bounceOutRight"
        >
          <login-form v-if="loginCard" v-on:logged="loggedIn" key="loginCard"></login-form>
          <profile-selector v-if="profileCard" :profiles="profiles" v-on:profile-selected="getScope" key="profileCard"></profile-selector>
          <realm-selector v-if="realmCard" v-on:realmSelected="realmSelected" key="realmCard"></realm-selector>
          <clinic-selector v-if="clinicCard" key="clinicCard" v-on:ClinicScopeSelected="finishLoggin"></clinic-selector>
          <store-selector v-if="storeCard" key="storeCard" v-on:StoreScopeSelected="finishLoggin"></store-selector>
        </transition-group>
        <div class="row justify-center items-center">
          <div class="col-xs-10 col-sm-8 col-md-6 col-lg-6 col-xl-6">
            <language-menu></language-menu>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import LanguageMenu from '../../components/menu/languageMenu'
import LoginForm from '../../components/auth/loginForm'
import RealmSelector from '../../components/scope/realmSelector'
import ClinicSelector from '../../components/scope/clinicSelector'
import StoreSelector from '../../components/scope/storeSelector'
import ProfileSelector from '../../components/profile/profileSelector'

export default {
  components: { LanguageMenu, LoginForm, RealmSelector, ClinicSelector, StoreSelector, ProfileSelector },
  data () {
    return {
      name: 'Login',
      visible: false,
      loginCard: true,
      realmCard: false,
      profileCard: false,
      clinicCard: false,
      storeCard: false,
      profiles: [],
      user: null,
      menus: null,
      routes: null
    }
  },
  methods: {
    restartLogin () {
      this.$store.dispatch('Auth/logOut')
      this.user = null
      this.profiles = []
      this.visible = false
      this.loginCard = true
      this.realmCard = false
      this.profileCard = false
      this.clinicCard = false
      this.storeCard = false
    },
    loggedIn (response) {
      // if (response) {
      //   console.log(response)
      //   return
      // }
      this.user = response.user
      this.menus = response.menus
      this.routes = response.routes
      this.loginCard = false
      this.checkProfiles()
    },
    getScope (id) {
      this.visible = true
      this.setProfile(id)
      this.$axios.get(this.$store.state.App.dataWarehouse + 'profiles', {
        params: {
          ids: [id],
          with: ['clinics', 'stores'],
          appends: [
            'storeScope',
            'clinicScope'
          ]
        }
      }).then((response) => {
        this.setUser()
        this.setStartModels(response.data.model[0])
        this.profileCard = false
        this.checkRealm()
      })
    },
    checkRealm () {
      let groups = Object.keys(this.user.groupsInfo)
      if (groups.includes('Administrators')) {
        this.visible = false
        this.realmCard = true
      } else this.checkClinics()
    },
    realmSelected (payload) {
      this.realmCard = false
      payload === 'clinics' ? this.checkClinics() : this.checkStores()
    },
    checkProfiles () {
      // console.log('Checking Profiles')
      if (this.user.profiles.length > 1) {
        this.profiles = this.user.profiles
        this.visible = false
        this.profileCard = true
      } else {
        if (!this.user.profile.clinicScope) {
          this.$store.dispatch('Notify/displayMessage', { message: 'User With No Clinics', position: 'top', type: 'negative' })
          this.restartLogin()
          return
        }
        this.setUser()
        this.setStartModels(this.user.profile)
        this.checkRealm()
      }
    },
    setStartModels (profile) {
      // console.log(profile)
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
        this.$store.commit('Model/setModel', { name: 'clinics', options: {} })
        this.$store.commit('Model/setModelItems', { name: 'clinics', items: profile.clinicScope })
      }
      if (profile.storeScope.length) {
        Object.keys(profile.storeScope).map((k) => {
          storeIds.push(profile.storeScope[k].id)
          if (!countryIds.includes(profile.storeScope[k].country_id)) {
            countries.push(profile.storeScope[k].country)
            countryIds.push(profile.storeScope[k].country_id)
          }
        })
        this.$store.commit('Model/setModel', { name: 'stores', options: {} })
        this.$store.commit('Model/setModelItems', { name: 'stores', items: profile.storeScope })
      }
      this.$store.commit('Model/setModel', { name: 'counties', options: {} })
      this.$store.commit('Model/setModelItems', { name: 'counties', items: counties })
      this.$store.commit('Model/setModel', { name: 'states', options: {} })
      this.$store.commit('Model/setModelItems', { name: 'states', items: states })
      this.$store.commit('Model/setModel', { name: 'countries', options: {} })
      this.$store.commit('Model/setModelItems', { name: 'countries', items: countries })

      this.$store.commit('Scope/initScope', { storeIds, clinicIds, countyIds, stateIds, countryIds })
    },
    checkClinics () {
      this.$store.commit('Scope/setScopeMode', 'clinic')
      if (this.$store.state.Scope.clinic.clinics.ids.length > 1) {
        this.clinicCard = true
        this.visible = false
      } else {
        this.finishLoggin()
      }
    },
    checkStores () {
      this.$store.commit('Scope/setScopeMode', 'store')
      if (this.$store.state.Scope.store.stores.ids.length > 1) {
        this.storeCard = true
        this.visible = false
      } else {
        this.finishLoggin()
      }
    },
    setUser () {
      this.$store.commit('User/setUser', this.user)
      this.$store.commit('App/setMenus', this.menus)
      this.$store.commit('App/setRoutes', this.routes)
    },
    setProfile (id) {
      this.user.profile = this.profiles.filter(profile => { return profile.id === id })[0]
    },
    finishLoggin () {
      if (!this.$store.state.App.settings['lang']) this.$store.commit('App/setSetting', { name: 'lang', value: this.$q.lang.isoName })
      if (!this.$store.state.App.settings['home']) this.$store.commit('App/setSetting', { name: 'home', value: this.$store.state.App.routes[0] })
      if (localStorage.lastPage) {
        this.$router.push({
          name: localStorage.lastPage
        }).catch(err => { console.log(err) })
      } else {
        console.log('No Page')
        this.$router.push({ name: this.$store.getters['App/homePage'] }).catch(err => { console.log(err) })
      }
    }
  }
}
</script>

<style>
</style>
