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
    },
    dateString (option = null, date = new Date(Date.now())) {
      let year = date.getFullYear()
      let month = (date.getMonth() < 9 ? '0' : '') + (Number(date.getMonth()) + 1)
      let day = null
      if (option === 'first') day = new Date(year, date.getMonth(), 1).getDate()
      else if (option === 'last') day = new Date(year, date.getMonth() + 1, 0).getDate()
      else day = date.getDate()
      let fullday = (day < 10 ? '0' : '') + day
      return year + '-' + month + '-' + fullday
    }
  }
}
