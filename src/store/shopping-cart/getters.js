export function Items (state) {
  let items = {
    categories: {},
    total: 0
  }
  if (!Object.keys(state).length) return items
  else {
    for (let category in state) {
      if (!items.categories[category]) items.categories[category] = 1
      else items.categories[category]++
      items.total += state[category].ids.length
    }
    return items
  }
}
export function hasItems (state, getters) {
  if (!getters.Items.total) return false
  return true
}
