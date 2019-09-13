import axios from 'axios'

function formConstructor (source) {
  let payload = new FormData()
  for (let key in source) {
    if (typeof source[key] === 'object' && key !== 'file') {
      for (let item in source[key]) {
        if (Array.isArray(source[key][item])) {
          let jsonArr = JSON.stringify(source[key][item])
          payload.append(item, jsonArr)
        } else {
          payload.append(item, source[key][item] !== null ? source[key][item] : '')
        }
      }
    } else if (Array.isArray(source[key])) {
      let jsonArr = JSON.stringify(source[key])
      payload.append(key, jsonArr)
    } else {
      payload.append(key, source[key] ? source[key] : '')
    }
  }
  return payload
}
export function updateScopedModels (context) {
  return new Promise((resolve, reject) => {
    if (context.rootState.Scope.clinic.clinics.selected.length > 9) {
      reject()
    }
    if (context.state.scoped.length) {
      let counter = context.state.scoped.length
      for (let name of context.state.scoped) {
        context.dispatch('getModel', { model: name, options: context.state.models[name].options })
          .then(() => {
            counter--
            if (!counter) {
              resolve()
            }
          })
          .catch((error) => reject(error))
      }
    } else {
      resolve()
    }
  })
}
export function cleanScopedModels (context) {
  return new Promise((resolve, reject) => {
    if (context.state.scoped.length) {
      let counter = context.state.scoped.length
      for (let name of context.state.scoped) {
        context.commit('clearModelItems', { model: name })
        counter--
        if (!counter) {
          resolve()
        }
      }
    } else {
      resolve()
    }
  })
}
export function getModel (context, { model, options }) {
  // console.log(options)
  if (!context.state.models[model]) {
    // console.log('Setting Model')
    context.commit('setModel', { name: model, options: options })
  } else {
    // console.log('Updating Model Options')
    context.commit('updateModelOptions', { name: model, options: options })
    options = context.state.models[model].options
  }
  // console.log(options)
  let params = {}
  if (options.scoped) {
    if (options.clinics) {
      params['clinic_id'] = options.clinics
    } else {
      params = context.rootState.Scope.mode === 'clinic' ? { clinic_id: context.rootState.Scope.clinic.clinics.selected } : { store_id: context.rootState.Scope.store.stores.selected.join() }
    }
  }
  if (options.full) {
    params['full'] = options.full
  }
  if (options.with) {
    params['with'] = options.with
  }
  if (options.appends) {
    params['appends'] = options.appends
  }
  if (options.withCount) {
    params['withCount'] = options.withCount
  }
  if (options.withTrashed) {
    params['withTrashed'] = options.withTrashed
  }
  if (options.where) {
    for (let modelName in options.where) {
      params[modelName] = options.where[modelName]
    }
  }
  if (options.paginate) {
    params['paginate'] = options.paginate
  }
  if (options.orderBy) {
    params['orderBy'] = options.orderBy
  }
  if (options.orderDesc) {
    params['orderDesc'] = options.orderDesc
  }
  if (options.fake) {
    params['fake'] = options.fake
  }
  return new Promise((resolve, reject) => {
    axios({
      url: context.rootState.App.dataWarehouse + model,
      method: 'GET',
      params: params
    }).then((response) => {
      context.commit('setModelItems', { name: model, items: response.data.model })
      // console.log(params)
      if (params['paginate']) context.commit('setModelPagination', { name: model, data: response.data.model })
      context.commit('setModelQuasarData', { name: model, data: response.data.quasarData })
      resolve()
    }).catch((error) => {
      reject(error)
    })
  })
}
export function getModelView (context, { model, id, params }) {
  return new Promise((resolve, reject) => {
    axios({
      url: context.rootState.App.dataWarehouse + model + '/' + id,
      method: 'GET',
      params: params
    }).then((response) => {
      context.commit('addViewFetched', { name: model, id: id })
      context.commit('updateModelItems', { name: model, item: response.data.model })
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export function getQuasarData (context, { model }) {
  return new Promise((resolve, reject) => {
    axios({
      url: context.rootState.App.dataWarehouse + 'quasar/?model=' + model,
      method: 'GET'
    }).then((response) => {
      context.commit('setModelQuasarData', { name: model, data: response.data.quasarData })
      resolve()
    }).catch((error) => {
      reject(error)
    })
  })
}
export function sendNewForm (context, { source }) { // CLEANED
  let payload = formConstructor(source)
  let headers = {}
  headers['Content-Type'] = 'multipart/form-data'
  return new Promise((resolve, reject) => {
    axios({
      url: source.url,
      method: 'POST',
      data: payload
      // headers: headers
    }).then(({ data }) => {
      resolve(data)
      resolve()
    }).catch((error) => {
      reject(error.response)
    })
  })
}
export function sendUpdateForm (context, { source }) { // CLEANED
  // console.log(source)
  let payload = formConstructor(source.model)
  payload.append('_method', 'PATCH')
  return new Promise((resolve, reject) => {
    axios({
      url: source.url,
      method: 'POST',
      data: payload
    }).then(({ data }) => {
      resolve(data)
    }).catch((error) => {
      reject(error.response)
    })
  })
}
export function removeModels (context, { name, items, softDeleting = false }) {
  // console.log(context.getters)
  return new Promise((resolve, reject) => {
    let deleted = 0
    let round = 0
    let errors = []
    for (let id of items) {
      round = round + 1
      axios({
        url: context.rootState.App.dataWarehouse + name + '/' + id,
        method: 'DELETE',
        params: context.getters.availableOptions[name]
      }).then(({ data }) => {
        deleted = deleted + 1
        // console.log(deleted)
        // console.log('Soft Deleting: ' + softDeleting)
        softDeleting ? context.commit('updateModelItems', { name: name, item: data.model }) : context.commit('removeModelItem', { name: name, id: id })
        if (deleted === items.length && items.length === round) {
          resolve(data)
        }
      }).catch((response) => {
        errors.push(response)
        if (items.length === round) {
          reject(response)
        }
      })
    }
  })
}
export function restoreModels (context, { name, items, nameSpace }) {
  // console.log(items)
  // console.log(name)
  // console.log(nameSpace)
  return new Promise((resolve, reject) => {
    let deleted = 0
    let round = 0
    let errors = []
    for (let id of items) {
      round = round + 1
      // console.log('Here')
      let payload = {
        'nameSpace': nameSpace,
        '_method': 'PATCH'
      }
      // console.log(payload)
      // payload['nameSpace'] = nameSpace
      // payload.append('_method', 'PATCH')
      axios({
        url: context.rootState.App.dataWarehouse + 'model/' + id + '/restore',
        method: 'POST',
        data: payload
      }).then(({ data }) => {
        deleted = deleted + 1
        // console.log('restored')
        context.commit('updateModelItems', { name: name, item: data.model })
        // context.dispatch('Notify/displayMessage', { message: data.message, position: 'top', type: 'positive' }, { root: true })
        if (deleted === items.length && items.length === round) {
          resolve(data)
        }
      }).catch((response) => {
        errors.push(response)
        if (items.length === round) {
          reject(response)
        }
      })
    }
  })
}
export function removeRelations (context, { name, items, relatedTo, parentIndex }) {
  // console.log(items)
  return new Promise((resolve, reject) => {
    let deleted = []
    let round = 0
    let errors = []
    for (let item of items) {
      axios({
        url: context.rootState.App.dataWarehouse + name + '/' + item.id,
        method: 'DELETE'
      }).then(({ data }) => {
        round = round + 1
        deleted.push(item)
        // console.log(deleted)
        // context.commit('removeRelationItems', {name: relatedTo, relation: name, index: item.index, parentIndex: parentIndex})
        if (items.length < 6) context.dispatch('Notify/displayMessage', { message: data.message, position: 'top', type: 'positive' }, { root: true })
        if (items.length === round) {
          // console.log('deleting')
          context.commit('removeRelationItemsById', { name: relatedTo, relation: name, items: deleted, parentIndex: parentIndex })
        }
        if (deleted.length === items.length && items.length === round) {
          resolve()
        }
      }).catch((error) => {
        round = round + 1
        errors.push(error)
        if (items.length === round) {
          reject(errors)
        }
      })
    }
  })
}
export function sendDestroyForm (context, { source }) { // CLEANED
  return new Promise((resolve, reject) => {
    axios({
      url: source.url,
      method: 'DELETE',
      data: source
    }).then(({ data }) => {
      resolve(data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export function sendFileDownloadForm (context, { source }) { // CLEANED
  return new Promise((resolve, reject) => {
    axios({
      url: source.url,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}
