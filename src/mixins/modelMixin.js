export const ModelsFetcher = {
  data () {
    return {
      modelsFetched: 0
    }
  },
  methods: {
    getModelsNeeded () {
      this.$q.loading.show({
        delay: 100
      })
      return new Promise((resolve, reject) => {
        if (this.modelsNeeded) {
          // console.log('Models Needed')
          let counter = 0
          let size = Object.keys(this.modelsNeeded).length
          for (let name in this.modelsNeeded) {
            let model = this.modelsNeeded[name]
            // if (this.modelName) {
            //   if (this.modelName === 'clinics' && this.model) model['clinics'] = [this.model.id]
            // }
            if (!this.$store.state.Model.models[name] || model.refresh) {
              // console.log('Getting Models')
              this.$store.dispatch('Model/getModel', {
                'model': name,
                'options': model
              }).then((response) => {
                counter = counter + 1
                if (counter === size) resolve(size)
              }).catch((error) => {
                counter = counter + 1
                this.$store.dispatch('Response/responseErrorManager', error.response)
                if (counter === size) reject()
              })
            } else if (!this.$store.state.Model.models[name].quasarData && !this.modelsNeeded[name].noQuasar) {
              this.$store.dispatch('Model/getQuasarData', {
                'model': name
              }).then((response) => {
                counter = counter + 1
                if (counter === size) resolve(size)
              }).catch((error) => {
                counter = counter + 1
                this.$store.dispatch('Response/responseErrorManager', error.response)
                if (counter === size) reject()
              })
            } else {
              counter = counter + 1
              if (counter === size) resolve(size)
            }
          }
        } else {
          // console.log('No Models Needed')
          this.$q.loading.hide()
        }
      })
    }
  },
  // created () {
  //   console.log('Created')
  //   this.getModelsNeeded().then((size) => {
  //     this.modelsFetched = size
  //     this.$q.loading.hide()
  //   }).catch((response) => {
  //     this.$q.loading.hide()
  //   })
  // },
  mounted () {
    // console.log('Model Fetcher Mounted Hook')
    this.getModelsNeeded().then((size) => {
      this.modelsFetched = size
      this.$q.loading.hide()
    }).catch((response) => {
      this.$q.loading.hide()
    })
  },
  updated () {
    // console.log('Model Fetcher Updated Hook')
  }
}
export const ModelBuilder = {
  methods: {
    buildModel (source = null) {
      if (source) {
        this.$set(this.model, 'id', source.id)
        this.$set(this.model, '__index', source.__index)
      }
      for (let step of this.quasarData.newLayout) {
        for (let row of step.fields) {
          for (let field in row) {
            let value
            if (row[field].type.name === 'boolean') {
              source ? value = source[field] : value = false
              this.$set(this.model, field, value)
            } else {
              source ? value = source[field] : value = null
              this.$set(this.model, field, value)
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
            this.$set(this.model, relation, data)
          }
        }
      }
    }
  }
}
export const ModelUpdaterBuilder = {
  methods: {
    buildUpdaterModel (source) {
      // console.log(source)
      if (source.length > 1) {
        this.buildUpdaterBatchModel(source)
        return
      }
      // console.log('Single Mode')
      this.$set(this.model, 'id', source.id)
      this.$set(this.model, '__index', source.__index)
      for (let step of this.quasarData.updateLayout) {
        for (let row of step.fields) {
          for (let field in row) {
            let value
            let defSource = source
            if (source && row[field].onObject) defSource = source[row[field].onObject]
            if (row[field].type.name === 'boolean') {
              defSource ? value = defSource[field] : value = false
              this.$set(this.model, field, value)
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
              this.$set(this.model, field, value)
            } else if (row[field].type.name === 'array') {
              if (defSource && defSource[field]) {
                let item = row[field].type.array.filter(i => { return i.value === defSource[field] })[0]
                value = item
              } else {
                value = null
              }
              this.$set(this.model, field, value)
            } else {
              defSource ? value = defSource[field] : value = null
              this.$set(this.model, field, value)
            }
          }
        }
        if (step.relations) {
          for (let relation of step.relations) {
            let data = []
            if (relation === 'clinics' && this.$store.state.Scope[relation].selected.length === 1 && !source) {
              data = [this.getModelById(relation, this.$store.state.Scope[relation].selected[0])]
            } else if (source) data = source[relation]
            this.$set(this.model, relation, data)
            if (this.quasarData.relations[relation].type === 'HasManyThrough') {
              data = source[this.quasarData.relations[relation].middleModel]
              this.$set(this.model, this.quasarData.relations[relation].middleModel, data)
            }
          }
        }
      }
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
    sendNewForm () {
      if (!this.cleanForm) {
        return false
      } else {
        this.$emit('formSent')
        let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(this.model) }
        this.saveModel(payload)
      }
    },
    cloneModel () {
      // this.$emit('formSent')
      // let payload = { name: this.name, model: this.fieldsObjectValueExtrator(this.model) }
      // console.log(payload)
      // this.saveModel(payload)
    },
    sendUpdateForm () {
      if (!this.cleanForm) {
        return false
      } else {
        this.$emit('formSent')
        if (this.batchMode) {
          for (let item of this.source) {
            let tempModel = JSON.parse(JSON.stringify(this.model))
            // for (let field in item) {
            //   if (!tempModel[field]) tempModel[field] = item[field]
            // }
            tempModel['id'] = item.id
            tempModel['__index'] = item.__index
            // console.log(model)
            let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(tempModel) }
            // console.log(payload)
            this.saveModel(payload)
          }
        } else {
          let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(this.model) }
          this.saveModel(payload)
        }
      }
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
            copy[field] = data[field].value
          }
        }
      }
      return copy
    },
    saveModel (payload) { // CLEANED
      // console.log(payload)
      if (this.mode === 'update') {
        this.saveModelOnUpdateController(payload)
      } else {
        this.saveModelOnNewController(payload)
      }
    },
    saveModelOnUpdateController (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.name + '/' + payload.model.id
      this.$store.dispatch('Model/sendUpdateForm', {
        'source': payload
      }).then((response) => {
        // if (payload.name === 'clinics') {
        //   this.$store.commit('Scope/updateScopeItems', { name: payload.name, item: response.model })
        // } else {
        //   this.$store.commit('Model/updateModelItems', { name: payload.name, item: response.model })
        // }
        this.$store.commit('Model/updateModelItems', { name: payload.name, item: response.model })
        this.$store.dispatch('Notify/displayMessage', { message: 'Profile updated', position: 'top', type: 'positive' })
        // this.buildUpdaterModel(response.model)
        this.$emit('relationFormResponded')
      }).catch((response) => {
        this.$emit('relationFormResponded')
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
    saveModelOnNewController (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.name
      this.$store.dispatch('Model/sendNewForm', {
        'source': payload
      }).then((response) => {
        this.$store.commit('Model/addModelItems', { name: payload.name, items: response.model })
        // this.$store.dispatch('Notify/displayMessage', { message: 'Model: ' + payload.name + ' Created', position: 'top', type: 'positive' })
        this.$store.dispatch('Notify/displayMessage', {
          message: this.$t('forms.messages.successCreate', {
            model: this.$tc('models.' + payload.name + '.name', 1),
            action: this.$tc('forms.actions.saved', 1)
          }),
          position: 'top',
          type: 'positive' })
        this.$emit('formRespondedOK')
      }).catch((response) => {
        this.$emit('formRespondedWithErrors')
        this.$store.dispatch('Response/responseErrorManager', response)
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
    relationFileDownload (payload) {
      this.gridItemLoading = payload.id
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id + '/download'
      this.$store.dispatch('Model/sendFileDownloadForm', {
        'source': payload
      }).then((response) => {
        // console.log(response.headers)
        let headers = response.headers['content-disposition'].split(';')
        let badname = headers[1].split('=')
        let name = badname[1].slice(1, -1)
        if (headers[2]) {
          let badname2 = headers[2].split('\'\'')
          // console.log(decodeURIComponent(badname2[1]))
          name = decodeURIComponent(badname2[1])
        }
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', name) // or any other extension
        document.body.appendChild(link)
        link.click()
        this.$store.dispatch('Notify/displayMessage', { message: 'File Downloaded', position: 'top', type: 'positive' }, { root: true })
        this.gridItemLoading = false
      }).catch((response) => {
        this.gridItemLoading = false
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
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
          this.$store.commit('Model/addRelationItems', { name: this.relatedTo, relation: payload.relation, items: response.model, parentIndex: this.model.__index })
          this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
          resolve(response)
        }).catch((response) => {
          this.$store.dispatch('Response/responseErrorManager', response)
          reject(response)
        })
      })
    },
    removeRelation (relation, index, id) { // CLEANED
      let payload = { relation: relation, index: index, id: id }
      if (this.mode === 'update') {
        if (this.relationData.type === 'MorphMany') this.removeMorpMany(payload)
        else if (this.relationData.type === 'HasMany') this.removeHasMany(payload)
        else if (this.relationData.type === 'BelongsToMany') this.removeBelongsToMany(payload)
      } else {
        this.model[payload.relation].splice(payload.index, 1)
      }
    },
    buildRelationPayload (relation) {
      // let id = false
      // if (this.editing !== false) id = this.editing].id
      let payload =
        {
          relation: relation,
          model: this.relationObjectsValueExtrator(relation, this.relation),
          index: this.editing,
          parentIndex: this.model.__index,
          id: this.relation['id']
        }
      return payload
    },
    relationObjectsValueExtrator (relation, data) {
      let fieldsToExtract = ['select', 'array', 'selectFromModel']
      let copy = {}
      for (let field in data) {
        this.$set(copy, field, data[field])
        if (this.relationData.quasarData.formFields[field] && data[field]) {
          if (fieldsToExtract.includes(this.relationData.quasarData.formFields[field].type.name)) {
            copy[field] = data[field].value
          }
        }
      }
      return copy
    },
    saveBatchRelation (relation, index = 0) {
      this.model['id'] = this.batchSource[this.batchRound].id
      this.model['__index'] = this.batchSource[this.batchRound].__index
      this.saveRelation(relation)
    },
    saveRelation (relation) { // CLEANED
      let payload = this.buildRelationPayload(relation)
      if (this.mode === 'update') {
        if (payload.index === false) {
          this.saveRelationOnUpdateController(payload)
        } else {
          // console.log('Updating')
          this.updateRelationOnUpdateController(payload)
        }
      } else if (payload.index === false) {
        this.saveRelationOnNewController(payload)
      } else {
        this.updateRelationOnNewController(payload)
      }
    },
    updateRelationBatch (relation) {
      for (let item of this.model[relation]) {
        let payload =
        {
          relation: relation,
          model: item,
          index: this.editing,
          parentIndex: this.model.__index,
          id: item.id
        }
        this.updateRelationOnUpdateController(payload)
      }
    },
    saveRelationOnNewController (payload) { // CLEANED
      // console.log('Save Relation on new Controller')
      // console.log(payload)
      if (typeof payload.model === 'number') this.model[payload.relation].push(this.getModelById(payload.relation, payload.model))
      else this.model[payload.relation].push(payload.model)
      this.closeRelationForm()
    },
    updateRelationOnNewController (payload) { // CLEANED
      if (this.relationData.type === 'BelongsToMany') {
        this.model[payload.relation].splice(payload.index, 1)
        this.model[payload.relation].push(this.getModelById(payload.relation, payload.model))
      } else {
        for (let field in payload.model) {
          this.model[payload.relation][payload.index][field] = payload.model[field]
        }
      }
    },
    saveRelationOnUpdateController (payload) { // CLEANED
      if (this.relationData.type === 'MorphMany') this.saveMorpMany(payload)
      else if (this.relationData.type === 'BelongsToMany') this.saveBelongsToMany(payload)
      else if (this.relationData.type === 'HasMany') this.saveHasMany(payload)
      else if (this.relationData.type === 'HasManyThrough') this.saveHasManyThrough(payload)
    },
    updateRelationOnUpdateController (payload) { // CLEANED
      if (this.relationData.type === 'MorphMany') this.updateMorpMany(payload)
      else if (this.relationData.type === 'BelongsToMany') this.saveBelongsToMany(payload)
      else if (this.relationData.type === 'HasMany') this.updateHasMany(payload)
      else if (this.relationData.type === 'HasManyThrough') this.updateHasManyThrough(payload)
    },
    sendNewRelationForm (payload) {
      this.relationLoader = true
      this.$store.dispatch('Model/sendNewForm', {
        'source': payload
      }).then((response) => {
        let options = {
          name: this.relatedTo,
          relation: payload.relation,
          items: response.model,
          parentIndex: this.model.__index,
          arrayPosition: this.relationData.quasarData.listFields.draggable ? 'end' : false
        }
        // console.log(options)
        this.$store.commit('Model/addRelationItems', options)
        this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
        this.relationLoader = false
        // this.closeRelationForm()
        if (this.batchMode) {
          this.batchRound++
          if (this.batchSource.length > this.batchRound) {
            this.saveBatchRelation(payload.relation, this.batchRound)
          } else {
            this.batchRound = 0
            this.closeRelationForm()
          }
        } else {
          this.batchRound = 0
          this.closeRelationForm()
        }
      }).catch((response) => {
        this.$store.dispatch('Response/responseErrorManager', response)
        this.relationLoader = false
      })
    },
    saveMorpMany (payload) { // CLEANED
      this.relationLoader = true
      payload.url = this.$store.state.App.dataWarehouse + payload.relation
      payload.relatedId = this.model.id
      payload.nameSpace = this.modelData.nameSpace
      this.sendNewRelationForm(payload)
    },
    saveBelongsToMany (payload) {
      // this.$store.dispatch('Notify/displayMessage', { message: 'saveBelongsToMany NOT IMPLEMENTED', position: 'top', type: 'negative' })
      // this.$store.dispatch('Notify/displayMessage', { message: 'Trying saveBelongsToMany', position: 'top', type: 'warning' })
      payload.url = this.$store.state.App.dataWarehouse + 'belongstomany'
      // payload[this.relationData.getForeignKeyName] = this.model.id
      payload['sourceModel'] = this.modelData.nameSpace
      payload['sourceModelId'] = this.model.id
      payload['relatedTo'] = this.relationData.nameSpace
      payload['relatedToID'] = this.relation.id
      this.sendNewRelationForm(payload)
    },
    saveHasMany (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + this.relatedTo + '/' + this.model.id + '/' + payload.relation
      payload[this.relationData.getForeignKeyName] = this.model.id
      this.sendNewRelationForm(payload)
    },
    saveHasManyThrough (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.relation
      this.sendNewRelationForm(payload)
    },
    sendUpdateRelationForm (payload) {
      this.relationLoader = true
      this.$store.dispatch('Model/sendUpdateForm', {
        'source': payload
      }).then((response) => {
        this.$store.commit('Model/updateRelationItems', { name: this.relatedTo, relation: payload.relation, item: response.model, parentIndex: this.model.__index })
        this.$store.dispatch('Notify/displayMessage', { message: 'Relation Saved', position: 'top', type: 'positive' })
        this.relationLoader = false
        // this.closeRelationForm()
        // return true
        if (this.batchMode) {
          this.batchRound++
          if (this.batchSource.length > this.batchRound) {
            this.saveBatchRelation(payload.relation, this.batchRound)
          } else {
            this.batchRound = 0
            this.closeRelationForm()
            return true
          }
        } else {
          this.batchRound = 0
          this.closeRelationForm()
          return true
        }
      }).catch((response) => {
        this.$store.dispatch('Response/responseErrorManager', response)
        this.relationLoader = false
        return false
      })
    },
    async updateMorpMany (payload) { // CLEANED
      // console.log('MorphMany')
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
      // console.log(payload)
      await this.sendUpdateRelationForm(payload)
    },
    async updateHasMany (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
      payload[this.relationData.getForeignKeyName] = this.model.id
      await this.sendUpdateRelationForm(payload)
    },
    async updateHasManyThrough (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
      await this.sendUpdateRelationForm(payload)
    },
    sendDestroyRelationForm (payload) {
      this.relationLoader = true
      this.$store.dispatch('Model/sendDestroyForm', {
        'source': payload
      }).then((response) => {
        let options = {
          name: this.relatedTo,
          relation: payload.relation,
          id: payload.id,
          parentIndex: this.model.__index
        }
        this.$store.commit('Model/removeRelationById', options)
        this.$store.dispatch('Notify/displayMessage', { message: response.message || payload.relation + ' successfully removed', position: 'top', type: 'positive' }, { root: true })
        this.relationLoader = false
      }).catch((response) => {
        this.relationLoader = false
        this.$store.dispatch('Response/responseErrorManager', response)
      })
    },
    removeMorpMany (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
      this.sendDestroyRelationForm(payload)
    },
    removeHasMany (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + payload.relation + '/' + payload.id
      this.sendDestroyRelationForm(payload)
    },
    removeBelongsToMany (payload) { // CLEANED
      payload.url = this.$store.state.App.dataWarehouse + 'belongstomany'
      payload['sourceModel'] = this.modelData.nameSpace
      payload['sourceModelId'] = this.model.id
      payload['relatedTo'] = this.relationData.nameSpace
      payload['relatedToID'] = this.relation.id
      this.sendDestroyRelationForm(payload)
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
      for (let item of this.model[relation]) {
        if (this.itemsOrderChanged.includes(item.id) || ids.includes(item.id)) {
          let payload =
          {
            relation: relation,
            model: item,
            index: this.editing,
            parentIndex: this.model.__index,
            id: item.id
          }
          this.updateRelationOnUpdateController(payload)
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
        parentIndex: this.model.__index,
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
            parentIndex: this.model.__index,
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
        parentIndex: this.model.__index,
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
            parentIndex: this.model.__index,
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
      this.$store.commit('Model/sortRelationItems', { name: this.relatedTo, index: this.model.__index, relation: this.relationData.name, field: this.relationData.quasarData.listFields.draggable })
      this.buildLastItemOrder()
      this.correctFieldOrderValue()
    }
    this.lastItemCount = this.model[this.relationData.name].length
  }
}
