export function cleanState (state) {
  state.models = {}
}
export function setModel (state, { name, options, cached = false }) {
  let model = {}
  model.creating = { state: false }
  model.destroyin = { state: false }
  model.updating = { items: [], state: false }
  model.idSelected = null
  model.itemSelected = null
  model.items = []
  model.state = null
  model.refreshed = null
  model.modelToSave = {}
  model.options = {
    scoped: options.scoped || false,
    scopedThrough: options.scopedThrough || false,
    clinics: options.clinics || false,
    full: options.full || false,
    with: options.with || false,
    appends: options.appends || false,
    withCount: options.withCount || false,
    withTrashed: options.withTrashed || false,
    where: options.where || false,
    paginate: options.paginate || false,
    orderBy: options.orderBy || false,
    orderDesc: options.orderDesc || false,
    fake: options.fake || false
  }

  model.viewsFetched = []
  model.pagination = null

  if (options.scoped) {
    state.scoped.push(name)
  }

  state.models = { ...state.models, [name]: model }
}

export function updateModelOptions (state, { name, options }) {
  state.models[name].options = {
    scoped: options.scoped || false,
    scopedThrough: options.scopedThrough || false,
    clinics: options.clinics || false,
    full: options.full || false,
    with: options.with || false,
    appends: options.appends || false,
    withCount: options.withCount || false,
    withTrashed: options.withTrashed || false,
    where: options.where || false,
    paginate: options.paginate || false,
    orderBy: options.orderBy || false,
    orderDesc: options.orderDesc || false,
    fake: options.fake || false
  }
}
export function setModelItems (state, { name, items }) {
  state.models[name].items = items.data ? items.data : items
  state.models[name].refreshed = Date.now()
}
export function addViewFetched (state, { name, id }) {
  state.models[name].viewsFetched.push(id)
}
export function setModelPagination (state, { name, data }) {
  // console.log('Here')
  state.models[name].pagination = data
}
export function clearModelItems (state, { model }) {
  state.models[model].items = []
}
export function setModelQuasarData (state, { name, data }) {
  state.models[name].quasarData = data
}
export function retrieveModel (state, { model }) {
  if (state.models[model]) {
    return state.models[model].items
  }
  return []
}
export function addModelItems (state, { name, items }) {
  // console.log('Adding: ' + items)
  state.models[name].items.unshift(items)
}
export function addRelationItems ({ models }, { name, relation, items, parentIndex, arrayPosition = false }) {
  // console.log(name)
  // console.log(relation)
  // console.log(items)
  // console.log(parentIndex)
  if (!arrayPosition) models[name].items[parentIndex][relation].unshift(items)
  else if (arrayPosition === 'end') models[name].items[parentIndex][relation].push(items)
  // console.log('After')
  // console.log(models[name].items[parentIndex][relation])
}
export function removeRelationItemsById (state, { name, relation, items, parentIndex }) {
  // console.log(name)
  // console.log(relation)
  // console.log(items)
  // console.log(parentIndex)
  let index
  for (let item of items) {
    for (let i = 0; i < state.models[name].items[parentIndex][relation].length; i++) {
      if (state.models[name].items[parentIndex][relation][i].id === item.id) {
        index = i
        state.models[name].items[parentIndex][relation].splice(index, 1)
        // console.log('DONE')
        break
      }
    }
  }
}
export function removeRelationItems (state, { name, relation, index, parentIndex }) {
  state.models[name].items[parentIndex][relation].splice(index, 1)
}
export function removeRelationById (state, { name, relation, id, parentIndex }) {
  for (let i = state.models[name].items[parentIndex][relation].length - 1; i >= 0; i--) {
    if (state.models[name].items[parentIndex][relation][i].id === id) {
      state.models[name].items[parentIndex][relation].splice(i, 1)
    }
  }
  // state.models[name].items[parentIndex][relation] = state.models[name].items[parentIndex][relation].filter(i => { return i.id !== id })
}
export function removeRelationByIds (state, { name, relation, id, parentId }) {
  // console.log('Removing Relation by Ids')
  let parent = state.models[name].items.filter(i => { return i.id === parentId })[0]
  for (let i = parent[relation].length - 1; i >= 0; i--) {
    if (parent[relation][i].id === id) {
      parent[relation].splice(i, 1)
    }
  }
}
export function removeModelItem ({ models }, { name, id }) {
  // console.log('NAme: ' + name)
  // console.log('ID: ' + id)
  let item = models[name].items.find((item) => item.id === id)
  // console.log(item)
  models[name].items.splice(models[name].items.indexOf(item), 1)
}
export function restoreModelItem ({ models }, { name, id }) {
  // console.log('NAme: ' + name)
  // console.log('ID: ' + id)
  let item = models[name].items.find((item) => item.id === id)
  // console.log(item)
  item.deleted_at = null
}
export function updateModelItems ({ models }, { name, item }) {
  // console.log('Updating Model Item')
  // console.log(name)
  // console.log(item)
  for (const [index, model] of models[name].items.entries()) {
    if (model.id === item.id) {
      for (let prop in item) {
        models[name].items[index][prop] = item[prop]
      }
    }
  }
}
export function updateRelationItems ({ models }, { name, relation, item, parentIndex }) {
  // console.log('Updating Relations')
  // console.log(name)
  // console.log(relation)
  // console.log(item)
  // console.log(parentIndex)
  for (let model of models[name].items[parentIndex][relation]) {
    if (model.id === item.id) {
      for (let prop in item) {
        model[prop] = item[prop]
      }
    }
  }
}
export function sortRelationItems ({ models }, { name, index, relation, field }) {
  models[name].items[index][relation].sort((a, b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
}
export function setRelationItemFieldValue ({ models }, { name, parentIndex, relation, index, field, value }) {
  models[name].items[parentIndex][relation][index][field] = value
}
export function moveRelationItemInArray ({ models }, { name, parentIndex, relation, index, positions }) {
  let source = models[name].items[parentIndex][relation].splice(index, 1)
  models[name].items[parentIndex][relation].splice((index + positions), 0, source[0])
}
export function revertRelationItemsOrder ({ models }, { name, parentIndex, relation, lastOrder }) {
  let oldArray = []
  for (let id of lastOrder) {
    oldArray.push(models[name].items[parentIndex][relation].filter(i => { return i.id === id })[0])
  }
  for (let i = models[name].items[parentIndex][relation].length - 1; i >= 0; i--) {
    models[name].items[parentIndex][relation].splice(i, 1, oldArray[i])
  }
}
