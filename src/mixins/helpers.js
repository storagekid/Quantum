export const Helpers = {
  data () {
    return {
      CustomSelectOriginalTypes: {}
    }
  },
  methods: {
    updateCustomSelect (object, payload, onRelation = false) {
      if (onRelation) {
        if (this.relationData.type === 'BelongsToMany') {
          console.log('BelongsToMany CustomSelect')
          this.relation = payload
          this.$v.relation.$touch()
        } else {
          this.relation[object] = payload
          this.$v.relation[object].$touch()
        }
      }
      if (object.indexOf('.') > -1) {
        let words = object.split('.')
        let mainObject = this[words[0]]
        for (let i = 1; i < words.length - 1; i++) {
          mainObject = mainObject[words[i]]
        }
        if (typeof this.CustomSelectOriginalTypes[object] === 'undefined') {
          this.CustomSelectOriginalTypes[object] = this.findOriginalObjectType(mainObject[words[words.length - 1]])
        }
        mainObject[words[words.length - 1]] = payload !== null ? payload : this.CustomSelectOriginalTypes[object]
      } else {
        if (typeof this.CustomSelectOriginalTypes[object] === 'undefined') {
          this.CustomSelectOriginalTypes[object] = this.findOriginalObjectType(this[object])
        }
        this[object] = payload !== null ? payload : this.CustomSelectOriginalTypes[object]
      }
    },
    findOriginalObjectType (object) {
      // console.log(object)
      return (object === null) ? null : Array.isArray(object) ? [] : (typeof object === 'object') ? {} : (typeof object === 'string') ? '' : false
    }
  }
}
