<template>
  <div>
    <slot :name="'body-cell-' + name" v-bind:item="cellItem">
      <span class="text-bold text-primary" v-if="cellItem.length < ($q.screen.lt.md ? 20 : 40)">{{ cellItem }}</span>
      <div class="text-bold text-primary ellipsis" style="max-width: 100px" v-else>
        {{ cellItem ? cellItem : '*' }}
        <q-tooltip content-style="font-size: 16px">
          <div style="max-width: 600px">{{ cellItem }}</div>
        </q-tooltip>
      </div>
    </slot>
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
