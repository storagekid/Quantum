export const Helpers = {
  methods: {
    groupedBy (array, key) {
      return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },
    log (params) {
      this.$store.commit('App/log', params)
    }
  }
}
