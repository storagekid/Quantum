export const FormMixins = {
  methods: {
    getErrors (field) {
      for (let param in field.$params) {
        if (!field[param]) {
          let error = 'forms.errors.' + param
          if (param === 'minLength') {
            return this.$t(error, { min: field.$params[param].min })
          } else if (param === 'maxLength') {
            return this.$t(error, { max: field.$params[param].max })
          }
          return this.$t(error)
        }
      }
    }
  }
}
