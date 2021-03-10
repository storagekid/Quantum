export const customSelectMixins = {
  data () {
    return {
      CustomSelectOriginalTypes: {}
    }
  },
  methods: {
    hideDatePicker (index) {
      let picker = 'qDateProxy-' + index
      // console.log(picker)
      if (this.$refs[picker][0]) this.$refs[picker][0].hide()
      else this.$refs[picker].hide()
    },
    getFamily () {
      let ids = []
      if (this.batchSource.children) {
        this.batchSource.children.map(i => { ids.push(i.id) })
      }
      ids.push(this.model.id)
      return ids
    },
    updateCustomSelect (object, payload, onRelation = false) {
      console.log('updateCustomSelect')
      console.log(object)
      console.log(payload)
      if (onRelation) {
        if (this.relationData.type === 'BelongsToMany') {
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
        if (payload === null || payload === undefined || payload === '' || !payload) {
          console.log('payload')
          console.log(payload)
          mainObject[words[words.length - 1]] = this.CustomSelectOriginalTypes[object]
        } else mainObject[words[words.length - 1]] = payload !== null ? payload : this.CustomSelectOriginalTypes[object]
      } else {
        if (typeof this.CustomSelectOriginalTypes[object] === 'undefined') {
          this.CustomSelectOriginalTypes[object] = this.findOriginalObjectType(this[object])
        }
        if (payload === null || payload === undefined || payload === '' || !payload) {
          console.log('payload')
          console.log(payload)
          this[object] = this.CustomSelectOriginalTypes[object]
        } else this[object] = payload !== null ? payload : this.CustomSelectOriginalTypes[object]
      }
    },
    findOriginalObjectType (object) {
      // console.log(object)
      return (object === null) ? null : Array.isArray(object) ? [] : (typeof object === 'object') ? {} : (typeof object === 'string') ? '' : false
    }
  }
}
