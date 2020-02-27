export const StationaryMixins = {
  data () {
    return {
      viewsNeeded: {
        clinics: {
          scope: true,
          view: 'stationary'
        }
      }
    }
  },
  watch: {
    scopeClinic () {
      // console.log('Cleaning ShoppingCart')
      this.$store.commit('ShoppingCart/cleanShoppingCart', { categories: null })
    }
  },
  computed: {
    stationaryReady () {
      if (!this.scopeFullClinic) return false
      if (!this.scopeFullClinic.stationary_products) return false
      return true
    },
    scopeFullClinic () {
      if (this.$store.getters['Scope/fullClinicSelected']) return this.$store.getters['Scope/fullClinicSelected']
      return null
    },
    staff () {
      let staff = { managers: [], odontologists: {} }
      let odontologists = [ 1, 4, 6, 7, 9, 11, 12 ]
      let managers = [ 5, 8 ]
      if (this.stationaryReady) {
        if (!this.scopeFullClinic.clinic_profiles) return null
        for (let person of this.scopeFullClinic.clinic_profiles) {
          for (let schedule of person.schedules) {
            if (odontologists.includes(schedule.job_type_id)) {
              if (!staff.odontologists[schedule.job_type.label]) this.$set(staff.odontologists, schedule.job_type.label, [])
              staff.odontologists[schedule.job_type.label].push(person)
            } else if (managers.includes(schedule.job_type_id)) {
              staff.managers.push(person)
            }
          }
        }
        return staff
      }
      return null
    },
    shoppingCart () {
      return this.$store.state.ShoppingCart
    },
    stationaryGrouped () {
      let grouped = { storeable: [], unstoreable: [], clinicStationaryCompleted: 0 }
      if (this.scopeFullClinic) {
        if (this.scopeFullClinic.stationary_products) {
          for (let product of this.scopeFullClinic.stationary_products) {
            if (product.product_category_id !== 1) continue
            if (product.storeable !== 0) {
              grouped.storeable.push(product)
              if (product.clinic_stationary) {
                if (product.clinic_stationary.af) grouped.clinicStationaryCompleted++
              }
            } else grouped.unstoreable.push(product)
          }
        }
      }
      return grouped
    }
  },
  methods: {
    shoppingCartToggle (item, category) {
      this.$store.commit('ShoppingCart/shoppingCartToggle', { item: item, 'category': category })
    },
    shoppingCartTimes (id, category, times) {
      this.$store.commit('ShoppingCart/shoppingCartTimes', { id: id, 'category': category, times: times })
    }
  }
}
