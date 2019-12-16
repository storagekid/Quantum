const log = function (params) {
  this.$store.commit('App/log', params)
}
export default log
