export const ModelFilterMixins = {
  data () {
    return {
      filterModelsFetched: 0,
      fetchingFilterModels: false
    }
  },
  computed: {
    formModels () {
      if (typeof this.filterModelsNeeded === 'undefined') return [this.modelName]
      let models = []
      for (let model in this.filterModelsNeeded) {
        if (!this.filterModelsNeeded[model]['filterType']) continue
        else if (this.filterModelsNeeded[model]['filterType'] === 'form') models.push(model)
      }
      return models
    },
    selectModels () {
      if (typeof this.filterModelsNeeded === 'undefined') return []
      let models = []
      for (let model in this.filterModelsNeeded) {
        if (!this.filterModelsNeeded[model]['filterType']) continue
        else if (this.filterModelsNeeded[model]['filterType'] === 'select') {
          let select = { model: model, multi: false }
          if (Array.isArray(this.modelFilter[this.modelName].values[this.filterModelsNeeded[model]['modelField']])) select.multi = true
          models.push(select)
        }
      }
      return models
    },
    waitForFilters () {
      if (this.filterModelsReady) return false
      return true
    },
    filterModelsReady () {
      if (typeof this.filterModelsNeeded === 'undefined') {
        // console.log('filterModelsNeeded true')
        return true
      } else if (Object.keys(this.filterModelsNeeded).length !== this.filterModelsFetched) {
        // console.log('filterModelsNeeded length: ' + Object.keys(this.filterModelsNeeded).length)
        // console.log('filterModelsFetched length: ' + this.filterModelsFetched)
        return false
      }
      // console.log('Returning true')
      return true
    },
    shouldFetchFilterModels () {
      if (this.fetchingFilterModels) return false
      return true
    }
  },
  methods: {
    filterModels () {
      this.updateFilteredModels([this.modelName])
    },
    updateFilterData (e) {
      // console.log(e)
      for (let field in e.values) {
        let updated = false
        for (let filter in this.modelFilter[e.model].values) {
          // if (updated) break
          if (filter === field) {
            this.modelFilter[e.model].values[field] = e.values[field]
            updated = true
            break
          }
        }
        if (!updated) {
          for (let filter in this.modelFilter[e.model].values) {
            // if (updated) break
            if (filter.indexOf(field) > -1) {
              this.modelFilter[e.model].values[filter] = e.values[field]
              break
            }
          }
        }
        // this.modelFilter[e.model].values[field] = e.values[field]
      }
    },
    updateSelectsData (e) {
      // console.log(e)
      for (let field in e.values) {
        if (!e.values[field]) continue
        if (Array.isArray(this.modelFilter[e.model].values[this.filterModelsNeeded[field].modelField])) {
          // console.log('Array')
          // console.log(e.values[field])
          this.modelFilter[e.model].values[this.filterModelsNeeded[field].modelField] = e.values[field]
          // this.modelFilter[e.model].values[this.filterModelsNeeded[field].modelField].push(e.values[field].value)
        } else this.modelFilter[e.model].values[this.filterModelsNeeded[field].modelField] = e.values[field].value
      }
    }
  },
  created () {
    if (this.shouldFetchFilterModels) {
      this.fetchingFilterModels = true
      this.getModelsNeeded('filterModelsNeeded').then((size) => {
        this.filterModelsFetched = size
        this.fetchingFilterModels = false
        this.$q.loading.hide()
      }).catch((response) => {
        this.fetchingFilterModels = false
        this.$q.loading.hide()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.log('beforeRouteEnter')
    next(vm => {
      // console.log('Next on beforeRouteEnter')
      if (vm.shouldFetchFilterModels) {
        vm.fetchingFilterModels = true
        vm.getModelsNeeded('filterModelsNeeded').then((size) => {
          vm.filterModelsFetched = size
          vm.fetchingFilterModels = false
          vm.$q.loading.hide()
        }).catch((response) => {
          vm.fetchingFilterModels = false
          vm.$q.loading.hide()
        })
      }
    })
  }
}
