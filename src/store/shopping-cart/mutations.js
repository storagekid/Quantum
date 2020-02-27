import Vue from 'vue'

export function setCategory (state, { name, model, headerText, itemKey }) {
  if (!state[name]) {
    Vue.set(state, name, { name, model, headerText, itemKey })
    Vue.set(state[name], 'ids', [])
    Vue.set(state[name], 'items', [])
    Vue.set(state[name], 'times', {})
  }
}
export function shoppingCartToggle (state, { item, category }) {
  console.log(category)
  if (state[category].ids.includes(item.id)) {
    state[category].ids.splice(state[category].ids.indexOf(item.id), 1)
    state[category].items.splice(state[category].items.findIndex(i => i.id === item.id), 1)
    delete state[category].times[item.id]
  } else {
    state[category].ids.push(item.id)
    state[category].items.push(item)
    Vue.set(state[category].times, item.id, item.provider.default_quantity / item.provider.min_quantity)
  }
}
export function shoppingCartTimes (state, { id, category, times }) {
  let total = state[category].times[id] + times
  if (total > 0) state[category].times[id] = total
}
export function cleanShoppingCart (state, { categories = null }) {
  if (!categories) {
    for (let category in state) {
      state[category].ids = []
      state[category].times = {}
    }
  } else {
    for (let category of categories) {
      state[category].ids = []
      state[category].times = {}
    }
  }
}
