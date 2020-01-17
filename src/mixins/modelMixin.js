export const ModelsFetcher = {
  data () {
    return {
      modelsFetched: 0,
      fetching: false,
      fetchingTime: null
    }
  },
  computed: {
    computedFecthing () {
      let object = this.modelsNeeded ? this.modelsNeeded : this.componentModels
      if (Object.keys(object).length !== this.modelsFetched) return true
      else {
        for (let model in object) {
          // console.log(model)
          if (!object[model].refresh) return false
          else if (!this.$store.state.Model.models[model].refreshed) {
            // console.log('Not Fetched yed')
            return true
          } else if (this.$store.state.Model.models[model].refreshed < this.fetchingTime) {
            if (!this.compareOptions(model, this.objectModelsName)) {
              // console.log('Options don\'t match')
              return true
            }
            return false
          }
          if (!this.compareOptions(model, this.objectModelsName)) {
            // console.log('Options don\'t match')
            return true
          }
        }
      }
      return false
    },
    objectModelsName () {
      return this.modelsNeeded ? 'modelsNeeded' : 'componentModels'
    },
    modelsReady () {
      if (this.computedFecthing) return false
      return true
    },
    comparedOptions () {
      let options = {}
      let object = this.modelsNeeded ? this.modelsNeeded : this.componentModels
      if (!Object.keys(object).length) return options
      for (let model in object) {
        options[model] = this.compareOptions(model)
      }
      return options
    }
  },
  methods: {
    applyFiltersToOptions (name) {
      let options = []
      for (let option in this.modelFilter[name].values) {
        if (this.modelFilter[name].values[option] === 'delay') {
          this.modelFilter[name].values[option] = ''
          continue
        } else if (!this.modelFilter[name].values[option]) continue
        let value = typeof this.modelFilter[name].values[option] === 'object' ? this.modelFilter[name].values[option].value : this.modelFilter[name].values[option]
        let operator = this.modelFilter[name].operators[option] ? this.modelFilter[name].operators[option] : '='
        options.push([option, operator, value])
      }
      return options
    },
    getModelsNeeded (object = this.objectModelsName) {
      this.$q.loading.show()
      // console.log('getModelsNeeded')
      return new Promise((resolve, reject) => {
        let counter = 0
        this.fetchingTime = Date.now()
        // console.log('Fetching Time Set')
        // console.log(object)
        // console.log(this[object])
        if (this[object]) {
          // console.log('getModelsNeeded')
          // console.log(object)
          let size = Object.keys(this[object]).length
          for (let name in this[object]) {
            let model = this[object][name]
            if (!this.$store.state.Model.models[name] || model.refresh) {
              // console.log('Getting Models')
              // console.log(name)
              // console.log(model)
              if (!this.$store.state.Model.models[name]) {
                // console.log('Not found in STORE')
              } else if (!this.$store.state.Model.models[name].items.length) {
                // console.log('No Items Yet in Model')
              } else if (this.compareOptions(name, object)) {
                // console.log('Same  Options')
                counter = counter + 1
                if (counter === size) resolve(size)
                continue
              }
              // console.log('Fetching: ' + name)
              if (this.modelFilter) {
                if (this.modelFilter[name]) {
                  model['where'] = this.applyFiltersToOptions(name)
                }
              }
              this.$store.dispatch('Model/getModel', {
                'model': name,
                'options': model
              }).then((response) => {
                // console.log('Response on model: ' + name)
                // console.log(response)
                counter = counter + 1
                if (counter === size) resolve(size)
              }).catch((error) => {
                // console.log('Catch on model: ' + name)
                counter = counter + 1
                this.$store.dispatch('Response/responseErrorManager', error.response)
                if (counter === size) reject(size)
              })
            } else if (!this.$store.state.Model.models[name].quasarData && !this[object][name].noQuasar) {
              this.$store.dispatch('Model/getQuasarData', {
                'model': name
              }).then((response) => {
                counter = counter + 1
                if (counter === size) resolve(size)
              }).catch((error) => {
                counter = counter + 1
                this.$store.dispatch('Response/responseErrorManager', error.response)
                if (counter === size) reject(size)
              })
            } else {
              counter = counter + 1
              if (counter === size) resolve(size)
            }
          }
        } else {
          this.$q.loading.hide()
        }
      })
    },
    updateFilteredModels (models) {
      this.$q.loading.show()
      let size = models.length
      let counter = 0
      for (let model of models) {
        let options = this[this.objectModelsName][model]
        options['where'] = this.applyFiltersToOptions(model)
        this.$store.dispatch('Model/getModel', {
          'model': model,
          'options': options
        }).then((response) => {
          counter = counter + 1
          if (counter === size) this.$q.loading.hide()
        }).catch((error) => {
          counter = counter + 1
          this.$store.dispatch('Response/responseErrorManager', error.response)
          if (counter === size) this.$q.loading.hide()
        })
      }
    },
    compareOptions (model) {
      // console.log('comparing')
      // console.log(model)
      // console.log(this.objectModelsName)
      let storeOptions = this.$store.getters['Model/availableOptions'][model]
      if (!Object.keys(this[this.objectModelsName][model]).length) return true
      for (let option in this[this.objectModelsName][model]) {
        if (!storeOptions[option]) return false
        else if (typeof this[this.objectModelsName][model][option] !== 'object') {
          if (this[this.objectModelsName][model][option] !== storeOptions[option]) return false
        } else {
          if (JSON.stringify(this[this.objectModelsName][model][option]) !== JSON.stringify(storeOptions[option])) return false
        }
      }
      return true
    }
  },
  created () {
    if (!this.fetching) {
      // console.log('created in ModelsFetcher')
      // vm.getModelsNeeded()
      this.fetching = true
      this.getModelsNeeded(this.objectModelsName).then((size) => {
        this.modelsFetched = size
        this.fetching = false
        this.$q.loading.hide()
      }).catch((response) => {
        this.fetching = false
        this.$q.loading.hide()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.log('beforeRouteEnter')
    next(vm => {
      // console.log('Next on beforeRouteEnter')
      if (!vm.fetching) {
        // console.log('Fetching False')
        vm.fetching = true
        let object = vm.modelsNeeded ? 'modelsNeeded' : 'componentModels'
        vm.getModelsNeeded(object).then((size) => {
          vm.modelsFetched = size
          vm.fetching = false
          vm.$q.loading.hide()
        }).catch((response) => {
          vm.fetching = false
          vm.$q.loading.hide()
        })
      }
    })
  }
}
export const ModelBuilder = {
  methods: {
    buildModel (source = null) {
      // console.log(source)
      let model = {}
      if (source) {
        this.$set(model, 'id', source.id)
      }
      for (let step of this.quasarData.newLayout) {
        for (let row of step.fields) {
          for (let field in row) {
            let value
            if (row[field].type.name === 'boolean') {
              source ? value = source[field] : value = false
              this.$set(model, field, value)
            } else {
              source ? value = source[field] : value = null
              this.$set(model, field, value)
            }
          }
        }
        if (step.relations) {
          for (let relation of step.relations) {
            let data = []
            if (relation === 'clinics' && this.$store.state.Scope.clinic[relation].selected.length === 1 && !source) {
              data = [this.getModelById(relation, this.$store.state.Scope.clinic[relation].selected[0])]
            } else if (relation === 'stores' && this.$store.state.Scope.store[relation].selected.length === 1 && !source) {
              data = [this.getModelById(relation, this.$store.state.Scope.store[relation].selected[0])]
            } else if (source) data = source[relation]
            this.$set(model, relation, data)
          }
        }
      }
      return model
    }
  }
}
export const ModelUpdaterBuilder = {
  methods: {
    buildUpdaterModel (source) {
      let model = {}
      // console.log(source)
      if (source.length > 1) {
        this.buildUpdaterBatchModel(source)
        return
      }
      // console.log('Single Mode')
      // console.log('ModelUpdaterBuilder')
      this.$set(model, 'id', source.id)
      for (let step of this.quasarData.updateLayout) {
        for (let row of step.fields) {
          for (let field in row) {
            // console.log(field)
            let value
            let defSource = source
            if (source && row[field].onObject) defSource = source[row[field].onObject]
            if (row[field].type.name === 'boolean') {
              defSource ? value = defSource[field] : value = false
              this.$set(model, field, value)
            } else if (row[field].type.name === 'select') {
              if (defSource && defSource[field]) {
                let relField
                if (field.indexOf('_id') > -1) {
                  relField = field.substr(0, field.indexOf('_id'))
                }
                if (relField && defSource[relField]) value = defSource[relField]
                else if (this.$store.state.Model.models[row[field].type.model]) {
                  let items
                  items = this.$store.state.Model.models[row[field].type.model].items
                  value = items.filter(i => { return i.id === defSource[field] })[0]
                } else {
                  value = defSource[field]
                }
              } else {
                value = null
              }
              this.$set(model, field, value)
            } else if (row[field].type.name === 'array') {
              if (defSource && defSource[field]) {
                let item = row[field].type.array.filter(i => { return i.value === defSource[field] })[0]
                value = item
              } else {
                value = null
              }
              this.$set(model, field, value)
            } else {
              defSource ? value = defSource[field] : value = null
              this.$set(model, field, value)
            }
          }
        }
        if (step.relations) {
          for (let relation of step.relations) {
            let data = []
            if (relation === 'clinics' && this.$store.state.Scope.clinic[relation].items.length === 1 && !source) {
              data = [this.getModelById(relation, this.$store.state.Scope.clinic[relation].items[0])]
            } else if (source) data = source[relation]
            this.$set(model, relation, data)
            if (this.quasarData.relations[relation].type === 'HasManyThrough') {
              data = source[this.quasarData.relations[relation].middleModel]
              this.$set(model, this.quasarData.relations[relation].middleModel, data)
            }
          }
        }
      }
      // console.log('End ModelUpdaterBuilder')
      return model
    },
    buildUpdaterBatchModel (source) {
      // console.log('BATCH MODE')
      let model = {}
      for (let step of this.quasarData.updateLayout) {
        for (let row of step.fields) {
          for (let field in row) {
            let value
            // console.log('BATCH MODE FIELD DATA:')
            // console.log(row[field])
            if (row[field].onObject) {
              // console.log('BATCH MODE ON OBJECT')
              // console.log(row[field].onObject)
              if (!model[row[field].onObject]) this.$set(model, row[field].onObject, {})
              for (let i = 0; i < source.length; i++) {
                // console.log(source[i][row[field].onObject][field])
                if (i === 0) value = source[i][row[field].onObject][field]
                else if (value === source[i][row[field].onObject][field]) continue
                else {
                  value = null
                  break
                }
              }
              this.$set(model[row[field].onObject], field, value)
            } else {
              for (let i = 0; i < source.length; i++) {
                if (i === 0) value = source[i][field]
                else if (value === source[i][field]) continue
                else {
                  value = null
                  break
                }
              }
              this.$set(model, field, value)
            }
          }
        }
        if (step.relations) {
          for (let relation of step.relations) {
            // console.log(relation)
            let value = null
            let removeFields = ['created_at', 'updated_at', 'deleted_at', 'id']
            for (let i = 0; i < source.length; i++) {
              if (i === 0) {
                if (!source[i][relation].length) {
                  // console.log('Vacio')
                  value = []
                  break
                }
                value = source[i][relation]
                // console.log(value)
              } else if (source[i][relation].length !== value.length) {
                // console.log('Different lengths')
                // console.log(source[i][relation].length)
                // console.log(value)
                // console.log(value.length)
                value = []
                break
              } else {
                // console.log('Same Lengths. Checking Arrays')
                // console.log('Checking Relations')
                for (let o = 0; o < source[i][relation].length; o++) {
                  let sourceCopy = {}
                  let valueCopy = {}
                  for (let field in source[i][relation][o]) {
                    if (!removeFields.includes(field) && Object.keys(this.quasarData.relations[relation].quasarData.formFields).includes(field)) {
                      sourceCopy[field] = source[i][relation][o][field]
                      valueCopy[field] = value[o][field]
                    }
                  }
                  // console.log(JSON.stringify(sourceCopy))
                  // console.log(JSON.stringify(valueCopy))
                  if (JSON.stringify(sourceCopy) !== JSON.stringify(valueCopy)) {
                    // console.log('Different Array')
                    value = []
                    break
                  }
                  // value.push(source[i][relation][o])
                }
              }
            }
            this.$set(model, relation, value)
          }
        }
      }
      // console.log('Model to Build')
      // console.log(model)
      this.buildUpdaterModel(model)
    }
  }
}

export const ModelRelations = {
  methods: {
    buildRelationData (relation, source = null) {
      // console.log('Building ' + relation.name)
      // console.log('Source')
      // console.log(source)
      if (source) this.$set(this.relation, 'id', source.id)
      let sameConstructor = ['MorphMany', 'HasManyThrough', 'HasMany']
      if (sameConstructor.includes(relation.type)) {
        for (let step of relation.quasarData.newLayout) {
          for (let row of step.fields) {
            for (let field in row) {
              let value
              if (row[field].type.name === 'boolean') {
                source ? value = source[field] : value = false
                this.$set(this.relation, field, value)
              } else if (row[field].type.name === 'array') {
                let value
                if (source) {
                  value = row[field].type.array.filter(i => { return i.value === source[field] })[0]
                } else {
                  value = null
                }
                this.$set(this.relation, field, value)
              } else if (['select', 'selectFromModel'].includes(row[field].type.name)) {
                if (source && source[field]) {
                  let relField
                  if (field.indexOf('_id') > -1) {
                    relField = field.substr(0, field.indexOf('_id'))
                  }
                  if (relField && source[relField]) value = source[relField]
                  else if (this.$store.state.Model.models[row[field].type.model] || this.$store.state.Scope[this.$store.state.Scope.mode][row[field].type.model]) {
                    let items
                    items = this.$store.state.Model.models[row[field].type.model] ? this.$store.state.Model.models[row[field].type.model].items : this.$store.state.Scope[this.$store.state.Scope.mode][row[field].type.model].items
                    value = items.filter(i => { return i.id === source[field] })[0]
                  } else {
                    value = source[field]
                  }
                } else {
                  value = null
                }
                this.$set(this.relation, field, value)
              } else {
                source ? value = source[field] : value = null
                this.$set(this.relation, field, value)
              }
              if (this.relationData.quasarData.listFields.draggable) {
                this.relation[this.relationData.quasarData.listFields.draggable] = this.model[this.relationData.name].length + 1
              }
            }
          }
        }
      }
      if (relation.type === 'BelongsToMany') {
        // this.$set(this.relation, relation.name, null)
      }
      if (relation.type === 'BelongsTo') {
        this.$set(this.relation, relation.name, null)
      }
    }
  }
}
export const ModelController = {
  methods: {
    async batchModel (data, batchSource) {
      // console.log('batchModel')
      // console.log(data)
      // console.log(batchSource)
      // let tempModel = JSON.parse(JSON.stringify(data.model))
      let batchRound = 0
      let failed = []
      let succeeded = []
      let payload = JSON.parse(JSON.stringify(data))
      while ((failed.length + succeeded.length) < (batchSource.length)) {
        payload.model['id'] = batchSource[batchRound].id
        await this.saveModel(payload, 'update')
          .then((response) => {
            batchRound++
            succeeded.push(batchSource[batchRound])
          }).catch((response) => {
            batchRound++
            failed.push(batchSource[batchRound])
          })
      }
      return true
    },
    buildModelToSend (name, model) {
      let data = {
        name: name,
        model: {},
        files: false
      }
      for (let field in model) {
        if (this.quasarData.formFields[field]) {
          if (this.quasarData.formFields[field].type.name === 'file') {
            if (model[field] instanceof File) {
              if (!data.files) data.files = {}
              data.files[field] = model[field]
            }
          } else data.model[field] = model[field]
        }
      }
      data.model = this.fieldsObjectValueExtrator(data.model)
      data.model.id = model.id
      return data
    },
    fieldsObjectValueExtrator (data) {
      let fieldsToExtract = ['select', 'array', 'enum', 'selectFromModel']
      let copy = {}
      for (let field in data) {
        // console.log(field)
        if (this.batchMode) {
          if (this.quasarData.formFields[field]) {
            if (!this.quasarData.formFields[field].batch) continue
          }
        }
        this.$set(copy, field, data[field])
        if (this.quasarData.fields.includes(field) && field !== 'id') {
          // console.log(field)
          if (fieldsToExtract.includes(this.quasarData.formFields[field].type.name) && data[field]) {
            copy[field] = data[field].value ? data[field].value : null
          }
        }
      }
      return copy
    },
    saveModel (payload, mode) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('saveModel')
        if (mode === 'update') {
          this.saveModelOnUpdateController(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        } else {
          this.saveModelOnNewController(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        }
      })
    },
    saveModelOnUpdateController (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + payload.name + '/' + payload.model.id
        payload.options = this.$store.getters['Model/availableOptions'][payload.name]
        // console.log('saveModelOnUpdateController')
        // console.log(payload)
        this.$store.dispatch('Model/sendUpdateForm', {
          'source': payload
        }).then((response) => {
          this.$store.commit('Model/updateModelItems', { name: payload.name, item: response.model })
          this.$store.dispatch('Notify/displayMessage', {
            message: this.$t('forms.messages.successAction', {
              model: this.$tc('models.' + payload.name + '.name', 1),
              action: this.$tc('forms.actions.updated', 1)
            }),
            position: 'top',
            type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    saveModelOnNewController (payload) { // CLEANED
      // console.log('saveModelOnNewController')
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + payload.name
        payload.options = payload.options ? { ...payload.options, ...this.$store.getters['Model/availableOptions'][payload.name] } : this.$store.getters['Model/availableOptions'][payload.name]
        this.$store.dispatch('Model/sendNewForm', {
          'source': payload
        }).then((response) => {
          this.$store.commit('Model/addModelItems', { name: payload.name, items: response.model })
          this.$store.dispatch('Notify/displayMessage', {
            message: this.$t('forms.messages.successAction', {
              model: this.$tc('models.' + payload.name + '.name', 1),
              action: this.$tc('forms.actions.saved', 1)
            }),
            position: 'top',
            type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    cloneModel (payload) { // CLEANED
      // console.log('saveModelOnNewController')
      // console.log(payload)
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + 'model/clone'
        payload.options = payload.options ? payload.options : this.$store.getters['Model/availableOptions'][payload.name]
        this.$store.dispatch('Model/sendCloneForm', {
          'source': payload
        }).then((response) => {
          // this.$store.commit('Model/addModelItems', { name: payload.name, items: response.model })
          this.$store.dispatch('Notify/displayMessage', {
            message: this.$t('forms.messages.successAction', {
              model: this.$tc('models.' + payload.name + '.name', 1),
              action: this.$tc('forms.actions.cloned', 1)
            }),
            position: 'top',
            type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    }
  }
}
export const RelationController = {
  data () {
    return {
      batchRound: 0
    }
  },
  methods: {
    async multiUploadFiles (payload) {
      // console.log('multiUploadFiles')
      // console.log(payload)
      this.$emit('multiUploadSent', { items: payload.items })
      let items = payload.items
      let success = []
      let failed = []
      payload.items = []
      payload.url = this.$store.state.App.dataWarehouse + this.relatedTo + '/' + this.model.id + '/' + payload.relation
      payload[this.relationData.getForeignKeyName] = this.model.id
      let round = 0
      while ((success.length + failed.length) < items.length) {
        payload.item = items[round]
        await this.sendFile(payload)
          .then((response) => {
            this.$emit('multiUploadFileSuccess', { index: round })
            success.push(response.model)
            // console.log('Success')
            // console.log('Success: ' + success.length)
            // console.log('Items: ' + items.length)
            round++
          }).catch(() => {
            this.$emit('multiUploadFileFailed', { index: round })
            failed.push(items[round])
            // console.log('Failed')
            // console.log('Failed: ' + failed.length)
            // console.log('Items: ' + items.length)
            round++
          })
      }
      this.$emit('multiUploadFinish')
      return true
    },
    sendFile (payload) {
      // console.log('Send File')
      // console.log(payload)
      return new Promise((resolve, reject) => {
        this.$store.dispatch('Model/sendNewForm', {
          'source': payload
        }).then((response) => {
          this.$store.commit('Model/addRelationItems', { name: this.relatedTo, relation: payload.relation, items: response.model, parentIndex: this.parentIndex })
          this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    buildRelationPayload (data) {
      // console.loglog(data)
      let payload = JSON.parse(JSON.stringify(data))
      payload.model = this.relationObjectsValueExtrator(data.model, data.quasarData)
      return payload
    },
    relationObjectsValueExtrator (data, quasarData) {
      let fieldsToExtract = ['select', 'array', 'selectFromModel']
      let copy = {}
      if (quasarData['quasarData']) quasarData = quasarData.quasarData
      for (let field in data) {
        this.$set(copy, field, data[field])
        if (quasarData.formFields[field] && data[field]) {
          if (fieldsToExtract.includes(quasarData.formFields[field].type.name)) {
            copy[field] = data[field].value
          }
        }
      }
      return copy
    },
    async batchRelation (payload, batchSource, mode, parentIndex) {
      // console.log('batchRelation')
      // console.log(payload)
      // console.log(batchSource)
      // console.log(mode)
      // console.log(parentIndex)
      let batchRound = 0
      let failed = []
      let succeeded = []
      while ((failed.length + succeeded.length) < (batchSource.length)) {
        payload.parentId = batchSource[batchRound].id
        payload.parentIndex = this.$store.state.Model.models[payload.parentName].items.findIndex((i) => { return i.id === batchSource[batchRound].id })
        // console.log(payload.parentIndex)
        let action = mode === 'update' ? 'updateRelation' : 'saveRelation'
        await this[action](payload)
          .then((response) => {
            batchRound++
            succeeded.push(batchSource[batchRound])
          }).catch((response) => {
            batchRound++
            failed.push(batchSource[batchRound])
          })
      }
      return true
    },
    saveRelation (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        if (payload.index === false) {
          this.saveRelationOnNewController(payload)
            .then((response) => {
              resolve(response)
            }).catch((response) => {
              reject(response)
            })
        } else {
          this.updateRelationOnNewController(payload)
            .then((response) => {
              resolve(response)
            }).catch((response) => {
              reject(response)
            })
        }
      })
    },
    updateRelation (payload) {
      payload.options = this.$store.state.Model.models[payload.parentName].quasarData.relationOptions[payload.relation]
      // console.log('updateRelation')
      // console.log(payload)
      // if (payload) return true
      return new Promise((resolve, reject) => {
        if (payload.index === false) {
          this.saveRelationOnUpdateController(payload)
            .then((response) => {
              resolve(response)
            }).catch((response) => {
              reject(response)
            })
        } else {
          this.updateRelationOnUpdateController(payload)
            .then((response) => {
              resolve(response)
            }).catch((response) => {
              reject(response)
            })
        }
      })
    },
    saveRelationOnNewController (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        if (typeof payload.model === 'number') this.model[payload.relation].push(this.getModelById(payload.relation, payload.model))
        else this.model[payload.relation].push(payload.model)
        resolve()
        // this.closeRelationForm()
      })
    },
    updateRelationOnNewController (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        if (this.relationData.type === 'BelongsToMany') {
          this.model[payload.relation].splice(payload.index, 1)
          this.model[payload.relation].push(this.getModelById(payload.relation, payload.model))
        } else {
          for (let field in payload.model) {
            this.model[payload.relation][payload.index][field] = payload.model[field]
          }
        }
        resolve()
      })
    },
    saveRelationOnUpdateController (payload) { // CLEANED
      // console.loglog('saveRelationOnUpdateController')
      return new Promise((resolve, reject) => {
        if (payload.quasarData.type === 'MorphMany') this.saveMorpMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'BelongsToMany') this.saveBelongsToMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'HasMany') this.saveHasMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'HasManyThrough') this.saveHasManyThrough(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    updateRelationOnUpdateController (payload) { // CLEANED
      // console.loglog('updateRelationOnUpdateController')
      // console.loglog(payload)
      return new Promise((resolve, reject) => {
        if (payload.quasarData.type === 'MorphMany') this.updateMorpMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'BelongsToMany') this.saveBelongsToMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'HasMany') this.updateHasMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'HasManyThrough') this.updateHasManyThrough(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    sendNewRelationForm (payload) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('Model/sendNewForm', {
          'source': payload
        }).then((response) => {
          let options = {
            name: payload.parentName,
            relation: payload.relation,
            items: response.model,
            parentIndex: payload.parentIndex,
            arrayPosition: payload.quasarData.quasarData.listFields.draggable ? 'end' : false
          }
          this.$store.commit('Model/addRelationItems', options)
          this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
          // console.log('Responded')
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    saveMorpMany (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('saveMorpMany')
        payload.url = this.$store.state.App.dataWarehouse + payload.relation
        payload.quasarInfo = { 'relatedId': payload.parentId, 'parentNameSpace': payload.parentNameSpace, 'relation': payload.relation }
        this.sendNewRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    saveBelongsToMany (payload) {
      return new Promise((resolve, reject) => {
        // console.log('saveBelongsToMany')
        payload.url = this.$store.state.App.dataWarehouse + 'belongstomany'
        payload.quasarInfo = {
          'parentID': payload.parentId,
          'parentNameSpace': payload.parentNameSpace,
          'relation': payload.relation,
          'relatedTo': payload.relatedTo,
          'relatedToID': payload.relatedToID
        }
        this.sendNewRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    saveHasMany (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('saveHasMany')
        payload.url = this.$store.state.App.dataWarehouse + payload.parentName + '/' + payload.parentId + '/' + payload.relation
        payload.quasarInfo = { 'relatedId': payload.parentId, 'parentNameSpace': payload.parentNameSpace, 'relation': payload.relation }
        payload.model[payload.quasarData.getForeignKeyName] = payload.parentId
        this.sendNewRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    saveHasManyThrough (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('saveHasManyThrough')
        payload.url = this.$store.state.App.dataWarehouse + payload.relation
        this.sendNewRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    sendUpdateRelationForm (payload) {
      // console.log('sendUpdateRelationForm')
      // console.log(payload)
      return new Promise((resolve, reject) => {
        this.$store.dispatch('Model/sendUpdateForm', {
          'source': payload
        }).then((response) => {
          let options = {
            name: payload.parentName,
            relation: payload.relation,
            item: response.model,
            parentIndex: payload.parentIndex
          }
          // console.log('responded 1')
          this.$store.commit('Model/updateRelationItems', options)
          // console.log('responded && Commited')
          this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    updateMorpMany (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('updateMorpMany')
        payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
        payload.quasarInfo = { 'relatedId': payload.parentId, 'parentNameSpace': payload.parentNameSpace, 'relation': payload.relation }
        this.sendUpdateRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    updateHasMany (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('updateHasMany')
        payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
        payload.model[payload.quasarData.getForeignKeyName] = payload.parentId
        this.sendUpdateRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    updateHasManyThrough (payload) { // CLEANED
      return new Promise((resolve, reject) => {
        // console.log('updateHasManyThrough')
        payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
        this.sendUpdateRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    removeRelation (payload) { // CLEANED
      // console.log('removeRelation')
      return new Promise((resolve, reject) => {
        if (payload.quasarData.type === 'MorphMany') this.removeMorpMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'HasMany') this.removeHasMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
        else if (payload.quasarData.type === 'BelongsToMany') this.removeBelongsToMany(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    sendDestroyRelationForm (payload) {
      // console.log('sendDestroyRelationForm')
      return new Promise((resolve, reject) => {
        this.$store.dispatch('Model/sendDestroyForm', {
          'source': payload
        }).then((response) => {
          let options = {
            name: payload.parentName,
            relation: payload.relation,
            id: payload.id,
            parentIndex: payload.parentIndex
          }
          this.$store.commit('Model/removeRelationById', options)
          this.$store.dispatch('Notify/displayMessage', { message: response.message || payload.relation + ' successfully removed', position: 'top', type: 'positive' }, { root: true })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    removeMorpMany (payload) { // CLEANED
      // console.log('removeMorpMany')
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
        this.sendDestroyRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    removeHasMany (payload) { // CLEANED
      // console.log('removeHasMany')
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
        this.sendDestroyRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    },
    removeBelongsToMany (payload) { // CLEANED
      // console.log('removeBelongsToMany')
      return new Promise((resolve, reject) => {
        payload.url = this.$store.state.App.dataWarehouse + 'belongstomany/' + payload.id
        this.sendDestroyRelationForm(payload).then((response) => { resolve(response) }).catch((response) => { reject(response) })
      })
    }
  }
}
export const SortingRelation = {
  data () {
    return {
      lastItemCount: 0,
      lastItemOrder: []
    }
  },
  watch: {
    relationItemsLength () {
      if (this.relationItemsLength > 0 && this.relationData.quasarData.listFields.draggable) {
        this.assingOrder()
        if (this.lastItemCount > this.relationItemsLength) {
          this.updateRelationOrder(this.relationData.name)
          this.extractFromOriginalOrder()
        } else {
          this.addToOriginalOrder()
        }
        this.lastItemCount = this.relationItemsLength
      }
    }
  },
  computed: {
    relationItemsLength () {
      return this.model[this.relationData.name].length
    },
    itemsOrderChanged () {
      if (!this.relationData.quasarData.listFields.draggable) return
      let items = []
      for (let i = 0; i < this.model[this.relationData.name].length; i++) {
        if (this.lastItemOrder[i] !== this.model[this.relationData.name][i].id) {
          items.push(this.model[this.relationData.name][i].id)
        }
      }
      return items
    }
  },
  methods: {
    updateRelationOrder (relation, ids = [], force = false) {
      this.$q.loading.show()
      for (let item of this.model[relation]) {
        if (this.itemsOrderChanged.includes(item.id) || ids.includes(item.id)) {
          let payload =
          {
            relation: relation,
            model: item,
            index: this.editing,
            parentIndex: this.parentIndex,
            parentName: this.relatedTo,
            parentId: this.model.id,
            id: item.id,
            quasarData: this.relationData
          }
          this.updateRelationOnUpdateController(payload).then((response) => {
            this.$q.loading.hide()
          }).catch((response) => {
            this.$q.loading.hide()
          })
        }
      }
      this.buildLastItemOrder()
    },
    addToOriginalOrder () {
      this.lastItemOrder.push(this.model[this.relationData.name][this.model[this.relationData.name].length - 1].id)
    },
    extractFromOriginalOrder () {
      let newIds = []
      for (let i = this.model[this.relationData.name].length - 1; i >= 0; i--) {
        newIds.push(this.model[this.relationData.name][i].id)
      }
      for (let oldId of this.lastItemOrder) {
        if (!newIds.includes(oldId)) this.lastItemOrder.splice(this.lastItemOrder.indexOf(oldId), 1)
      }
    },
    revertOrder () {
      this.$store.commit('Model/revertRelationItemsOrder', {
        name: this.relatedTo,
        parentIndex: this.parentIndex,
        relation: this.relationData.name,
        lastOrder: this.lastItemOrder
      })
      this.assingOrder()
    },
    assingOrder () {
      for (let i = this.model[this.relationData.name].length - 1; i >= 0; i--) {
        if (this.model[this.relationData.name][i][this.relationData.quasarData.listFields.draggable] !== i + 1) {
          this.$store.commit('Model/setRelationItemFieldValue', {
            name: this.relatedTo,
            parentIndex: this.parentIndex,
            relation: this.relationData.name,
            index: i,
            field: this.relationData.quasarData.listFields.draggable,
            value: i + 1
          })
        }
      }
    },
    filterArrayUnique (relation, field, values) {
      let newValues = []
      for (let item of values) {
        newValues.push(item)
      }
      for (let i = this.model[relation].length - 1; i >= 0; i--) {
        let value = this.model[relation][i][field]
        if (newValues.includes(value)) newValues.splice(newValues.indexOf(value), 1)
      }
      return newValues
    },
    moveRelation (relation, index, positions) {
      this.$store.commit('Model/moveRelationItemInArray', {
        name: this.relatedTo,
        parentIndex: this.parentIndex,
        relation: this.relationData.name,
        index: index,
        positions: positions
      })
      this.assingOrder()
    },
    buildLastItemOrder () {
      this.lastItemOrder = []
      for (let item of this.model[this.relationData.name]) {
        this.lastItemOrder.push(item.id)
      }
    },
    correctFieldOrderValue () {
      let wrongValues = []
      for (let i = this.model[this.relationData.name].length - 1; i >= 0; i--) {
        if (this.model[this.relationData.name][i][this.relationData.quasarData.listFields.draggable] !== i + 1) {
          this.$store.commit('Model/setRelationItemFieldValue', {
            name: this.relatedTo,
            parentIndex: this.parentIndex,
            relation: this.relationData.name,
            index: i,
            field: this.relationData.quasarData.listFields.draggable,
            value: i + 1
          })
          wrongValues.push(this.model[this.relationData.name][i].id)
        }
      }
      if (wrongValues.length) this.updateRelationOrder(this.relationData.name, wrongValues)
    }
  },
  created () {
    if (this.relationData.quasarData.listFields.draggable) {
      this.$store.commit('Model/sortRelationItems', { name: this.relatedTo, index: this.parentIndex, relation: this.relationData.name, field: this.relationData.quasarData.listFields.draggable })
      this.buildLastItemOrder()
      this.correctFieldOrderValue()
    }
    this.lastItemCount = this.model[this.relationData.name].length
  }
}
