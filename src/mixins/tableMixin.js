export const searchMethods = {
  data () {
    return {
      filterIds: []
    }
  },
  methods: {
    filterMethod (rows, terms, cols = this.computedCols, cellValue = this.getCellValue) {
      let app = this
      // let countingFields = ['=1=', '=2=']
      if (terms.indexOf('&&') > -1 && terms.length > 4) {
        let words = terms.toLowerCase().split('&&')
        words.forEach((i) => {
          // Finding Clones
          if (i.indexOf('=2=') > -1) {
            // console.log('Finding Clones')
            let columnName = i.split('=2=')
            let countedValues = {}
            let col = cols.filter(function (col) { return col.label.toLowerCase() === columnName[0] })[0]
            rows.forEach((row) => {
              // let value = app.getItem(row, col.name) + ''
              let value = app.getParseItem(app.getItem(row, col.name)) + ''
              if (!countedValues[value]) countedValues[value] = 1
              else countedValues[value]++
            })
            rows = rows.filter((row) => {
              let value = app.getParseItem(app.getItem(row, col.name)) + ''
              // let value = app.getItem(row, col.name) + ''
              return value && countedValues[value] > 1
            })
            // console.log(countedValues)
          // Finding Uniques
          } else if (i.indexOf('=1=') > -1) {
            // console.log('Finding Uniques')
            let columnName = i.split('=1=')
            let countedValues = {}
            let col = cols.filter(function (col) { return col.label.toLowerCase() === columnName[0] })[0]
            rows.forEach((row) => {
              let value = app.getParseItem(app.getItem(row, col.name)) + ''
              // let value = app.getItem(row, col.name) + ''
              if (!countedValues[value]) countedValues[value] = 1
              else countedValues[value]++
            })
            rows = rows.filter((row) => {
              let value = app.getParseItem(app.getItem(row, col.name)) + ''
              // let value = app.getItem(row, col.name) + ''
              return value && countedValues[value] === 1
            })
            // console.log(countedValues)
          } else {
            rows = rows.filter(
              row => cols.some(function (col) {
                // let value = app.getItem(row, col.name) + ''
                let value = app.getParseItem(app.getItem(row, col.name)) + ''
                // if (Array.isArray(value)) {
                //   value = JSON.stringify(value)
                // } else if (typeof value === 'object') {
                //   value = JSON.stringify(value)
                // }
                if (i.indexOf('==') > -1) {
                  let columnName = i.split('==')
                  if (col.label.toLowerCase() === columnName[0]) {
                    if (columnName[1][0] === '"') {
                      // console.log(columnName[1].substring(1))
                      if (value.toLowerCase() === columnName[1].substring(1)) {
                        return true
                      }
                    }
                    if (!columnName[1]) return (value === null || value === '' || value === 'false')
                    return value.toLowerCase().indexOf(columnName[1]) !== -1
                  }
                } else if (i.indexOf('=in=') > -1) {
                  let columnName = i.split('=in=')
                  if (col.label.toLowerCase() === columnName[0]) {
                    let finds = columnName[1].split('|')
                    // console.log('Finds')
                    for (let find of finds) {
                      // if (!find) continue
                      // console.log(value)
                      if (value.toLowerCase().indexOf(find) > -1) return true
                    }
                    return false
                  }
                } else if (i.indexOf('!=') > -1) {
                  let columnName = i.split('!=')
                  if (col.label.toLowerCase() === columnName[0]) {
                    // console.log(columnName[0])
                    // console.log(value)
                    if (!columnName[1]) return (value !== '' && value !== 'false')
                    return value.toLowerCase().indexOf(columnName[1]) === -1
                  }
                }
                if (i[0] === '"') {
                  // console.log(i.substring(1))
                  if (value.toLowerCase() === i.substring(1)) {
                    return true
                  }
                } else return value.toLowerCase().indexOf(i) !== -1
              }, app)
            )
          }
        })
        let ids = []
        for (let i = rows.length - 1; i >= 0; i--) {
          ids.push(rows[i].id)
        }
        this.filterIds = ids
        return rows
      }
      // Simple Search
      const lowerTerms = terms ? terms.toLowerCase() : ''
      rows = rows.filter(
        row => cols.some(function (col) {
          let value = app.getItem(row, col.name) + ''
          return value.toLowerCase().indexOf(lowerTerms) !== -1
        }, app)
      )
      let ids = []
      for (let i = rows.length - 1; i >= 0; i--) {
        ids.push(rows[i].id)
      }
      this.filterIds = ids
      return rows
    },
    getItem (row, name) {
      // console.log(name)
      if (name.indexOf('.') > -1) {
        // console.log('has dot')
        let names = name.split('.')
        let item = row[names[0]]
        if (typeof item === 'boolean') return item
        if (!item) return ''
        for (let i = 1; i < names.length; i++) {
          if (!item[names[i]]) return ''
          item = item[names[i]]
          if (typeof item === 'boolean') return item
          if (!item) return ''
        }
        if (typeof item === 'object') {
          // console.log('object')
          return item.label
        } else if (typeof item === 'boolean') return item
        return item
      }
      // console.log('End')
      return row[name] ? row[name] : ''
    },
    getParseItem (item) {
      if (typeof item === 'object') return JSON.stringify(item)
      return item
    },
    getObject (row, name) {
      if (name.indexOf('.') > -1) {
        let names = name.split('.')
        let item = row[names[0]]
        if (!item) return ''
        for (let i = 1; i < names.length - 1; i++) {
          if (!item) return ''
          item = item[names[i]]
        }
        return item
      }
      return row[name]
    },
    customSort (rows, sortBy, descending) {
      let data = [...rows]

      if (sortBy) {
        data.sort((a, b) => {
          let x = descending ? b : a
          let y = descending ? a : b
          if (sortBy) {
            // string sort
            if (sortBy.indexOf('.') > -1) {
              // console.log(sortBy)
              let words = sortBy.split('.')
              x = x[words[0]] || ''
              y = y[words[0]] || ''
              let round = 1
              while (round < words.length && (x !== '' && y !== '')) {
                x = x[words[round]]
                y = y[words[round]]
                round++
              }
              // console.log(x)
              // console.log(y)
            } else {
              x = x[sortBy]
              y = y[sortBy]
            }
            return x > y ? 1 : x < y ? -1 : 0
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }

      return data
    }
  }
}
