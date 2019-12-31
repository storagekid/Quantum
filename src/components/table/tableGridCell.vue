<template>
  <div>
    <template v-if="Array.isArray(cellItem)">
      <ul>
        <li v-for="(item, index) in cellItem" :key="'ai' + index">
          {{ item.label }}
        </li>
      </ul>
    </template>
    <template v-else>
      {{ cellItem }}
    </template>
  </div>
</template>

<script>
export default {
  name: 'TableCell',
  props: ['item', 'row', 'name'],
  data () {
    return {}
  },
  computed: {
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
      return this.row[this.name] ? this.row[this.name] : ''
    }
  }
}
</script>
