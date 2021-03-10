<template>
  <div>
      <div v-if="columnType === 'boolean'" class="q-pl-sm">
        <q-icon size="xs" name="check_circle" v-if="(cellItem && !columnTypeOptions.length) || (columnTypeOptions.length && !cellItem)" color="positive"></q-icon>
        <q-icon size="xs" name="clear" v-else color="negative"></q-icon>
      </div>
      <template v-else-if="columnType === 'file'">
        <div v-if="cellItem">
          <q-img style="max-height: 100px" contain :src="$store.state.App.publicSources + '/' + cellItem">
          </q-img>
          <q-tooltip self="center left" anchor="center left" content-style="min-width: 300px; max-height: 300px display: flex">
            <q-img :src="$store.state.App.publicSources + '/' + cellItem">
            </q-img>
          </q-tooltip>
        </div>
        <span v-else class="text-negative text-bold q-pl-lg"> - </span>
      </template>
      <template v-else-if="Array.isArray(cellItem)">
        <template v-if="columnType === 'array'">
          <span v-if="columnTypeOptions.mode === 'count'">{{cellItem.length}}</span>
        </template>
        <ul v-else-if="cellItem.length" class="q-ma-none">
          <li v-for="(item, index) in cellItem" :key="'ai' + index" style="line-height: 0">
            <span class="text-bold text-italic text-caption" style="line-height: 1.2">{{ item.label}}</span>
          </li>
        </ul>
        <span v-else class="text-negative text-bold q-pl-lg"> - </span>
      </template>
      <div class="" v-else>
        <span v-if="!cellItem" class="text-negative text-bold q-pl-md"> - </span>
        <span v-else-if="columnType === 'currency'">{{ parseFloat(cellItem) + ' €'}}</span>
        <template v-else>
          <template v-if="columnTypeOptions.linebreak">
            <div v-if="!textToolarge(breakLines(cellItem).upperLine)">{{ breakLines(cellItem).upperLine }}</div>
            <div class="text-bold text-primary ellipsis" style="max-width: 100px" v-else>
              {{ breakLines(cellItem).upperLine ? breakLines(cellItem).upperLine : '*' }}
              <q-tooltip content-style="font-size: 16px">
                <div style="max-width: 600px">{{ breakLines(cellItem).upperLine }}</div>
              </q-tooltip>
            </div>
            <div v-if="!textToolarge(breakLines(cellItem).bottomLine, 40)" class="text-caption">{{ breakLines(cellItem).bottomLine }}</div>
            <div class="ellipsis text-caption" style="max-width: 100px" v-else>
              {{ breakLines(cellItem).bottomLine ? breakLines(cellItem).bottomLine : '*' }}
              <q-tooltip content-style="font-size: 16px">
                <div style="max-width: 600px">{{ breakLines(cellItem).bottomLine }}</div>
              </q-tooltip>
            </div>
          </template>
          <div class="text-bold text-primary ellipsis" style="max-width: 100px" v-else-if="itemTooLarge">
            {{ cellItem ? cellItem : '*' }}
            <q-tooltip content-style="font-size: 16px">
              <div style="max-width: 600px">{{ cellItem }}</div>
            </q-tooltip>
          </div>
          <span v-else>{{ cellItem }}</span>
        </template>
      </div>
  </div>
</template>

<script>
export default {
  name: 'TableCell',
  props: ['row', 'name', 'column'],
  data () {
    return {}
  },
  computed: {
    itemTooLarge () {
      if (typeof this.cellItem !== 'string') return false
      return this.cellItem.length > (this.$q.screen.lt.md ? 20 : 40)
    },
    cellItemType () {
      return typeof this.cellItem
    },
    columnType () {
      return this.column.type.name
    },
    columnTypeOptions () {
      return this.column.type.options
    },
    cellItem () {
      // console.log(this.name)
      if (this.name.indexOf('.') > -1) {
        let names = this.name.split('.')
        let item = this.row[names[0]]
        if (typeof item === 'boolean') return item
        if (!item) return ''
        for (let i = 1; i < names.length; i++) {
          if (!item[names[i]]) return ''
          item = item[names[i]]
          if (typeof item === 'boolean') return item
          if (!item) return ''
        }
        if (typeof item === 'object') return item.label
        else if (typeof item === 'boolean') return item
        return item
      }
      // return 'patat'
      const value = this.row[this.name] ? this.row[this.name] : ''
      if (this.column.keyNames) return this.column.keyNames[value]
      return value
    }
  },
  methods: {
    textToolarge (text, length = 40) {
      // console.log(text)
      return text.length > (this.$q.screen.lt.md ? 20 : length)
    },
    breakLines (text) {
      // console.log(text)
      let upperLine = ''
      let bottomLine = ''
      for (let needle of this.columnTypeOptions.linebreak.needles) {
        if (text.indexOf(needle) > -1) {
          upperLine = text.substring(0, text.indexOf(needle))
          bottomLine = text.substring(text.indexOf(needle))
          break
        }
      }
      return { upperLine, bottomLine }
    },
    upperLine (text) {
      let upperLine = ''
      for (let needle of this.columnTypeOptions.linebreak.needles) {
        if (text.indexOf(needle) > -1) {
          upperLine = text.substring(0, text.indexOf(needle))
          break
        }
      }
      return upperLine
    },
    bottomLine (text) {
      let upperLine = ''
      for (let needle of this.columnTypeOptions.linebreak.needles) {
        if (text.indexOf(needle) > -1) {
          upperLine = text.substring(0, text.indexOf(needle))
          break
        }
      }
      return upperLine
    }
  }
}
</script>
