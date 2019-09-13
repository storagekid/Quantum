export function availableOptions (state) {
  let options = {}
  for (let model in state.models) {
    options[model] = {}
    for (let option in state.models[model].options) {
      if (state.models[model].options[option] !== false) options[model][option] = state.models[model].options[option]
    }
  }
  return options
}
