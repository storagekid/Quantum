<template>
  <side-panel
    panelName="Size & Space"
    :panelDisabled="panelDisabled"
    v-if="selectedElement"
    >
    <template v-slot:panel-content>
      <q-input dense type="text" label="Width" v-model="selectedElement.styles.width"></q-input>
      <q-input dense type="text" label="Height" v-model="selectedElement.styles.height"></q-input>
      <q-separator />
      <div class="text-caption bg-secondary text-primary q-py-xs">Padding</div>
      <div class="row padding-row q-gutter-xs justify-between">
        <div class="row">
          <q-input dense type="number" label="Top" v-model="padding.top" class="padding-input"></q-input>
          <q-btn :color="padding.linkV ? 'primary' : 'accent'" flat dense size="sm" class="q-mr-xs" :icon="padding.linkV ? 'link' : 'link_off'" @click="linkPaddings('V')"></q-btn>
          <q-input dense type="number" label="Bottom" v-model="padding.bottom"></q-input>
        </div>
        <q-btn :color="padding.linkAll ? 'primary' : 'accent'" flat dense size="md" :icon="padding.linkAll ? 'link' : 'link_off'" @click="linkPaddings('A')"></q-btn>
        <div class="row">
          <q-input dense type="number" label="Left" v-model="padding.left"></q-input>
          <q-btn :color="padding.linkH ? 'primary' : 'accent'" flat dense size="sm" class="q-mr-xs" :icon="padding.linkH ? 'link' : 'link_off'" @click="linkPaddings('H')"></q-btn>
          <q-input dense type="number" label="Right" v-model="padding.right"></q-input>
        </div>
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'SizeAndSpacePanel',
  props: ['selectedElement'],
  components: { SidePanel },
  data () {
    return {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        linkV: true,
        linkH: true,
        linkAll: true,
        lastChanged: null
      }
    }
  },
  watch: {
    selectedElement () {
      console.log('Element Changed')
      if (this.selectedElement) this.parsePadding()
    },
    'padding.top' () {
      if (this.padding.linkV) this.padding.bottom = this.padding.top
      if (this.padding.linkAll) {
        this.padding.left = this.padding.top
        this.padding.right = this.padding.top
      }
      this.padding.lastChanged = 'top'
      this.selectedElement.styles['padding'] = this.elementPadding
    },
    'padding.bottom' () {
      if (this.padding.linkV) this.padding.top = this.padding.bottom
      if (this.padding.linkAll) {
        this.padding.left = this.padding.bottom
        this.padding.right = this.padding.bottom
      }
      this.padding.lastChanged = 'bottom'
      this.selectedElement.styles['padding'] = this.elementPadding
    },
    'padding.left' () {
      if (this.padding.linkH) this.padding.right = this.padding.left
      if (this.padding.linkAll) {
        this.padding.top = this.padding.left
        this.padding.bottom = this.padding.left
      }
      this.padding.lastChanged = 'left'
      this.selectedElement.styles['padding'] = this.elementPadding
    },
    'padding.right' () {
      if (this.padding.linkH) this.padding.left = this.padding.right
      if (this.padding.linkAll) {
        this.padding.top = this.padding.right
        this.padding.bottom = this.padding.right
      }
      this.padding.lastChanged = 'right'
      this.selectedElement.styles['padding'] = this.elementPadding
    }
  },
  computed: {
    elementPadding () {
      let top = this.padding.top !== 0 ? this.padding.top + 'px' : this.padding.top
      let bottom = this.padding.bottom !== 0 ? this.padding.bottom + 'px' : this.padding.bottom
      let left = this.padding.left !== 0 ? this.padding.left + 'px' : this.padding.left
      let right = this.padding.right !== 0 ? this.padding.right + 'px' : this.padding.right
      return top + ' ' + right + ' ' + bottom + ' ' + left
    },
    panelDisabled () {
      if (!this.selectedElement) return true
      let approvedNodes = ['td', 'img', 'a']
      if (approvedNodes.includes(this.selectedElement.name.toLowerCase())) return false
      return true
    }
  },
  methods: {
    parsePadding () {
      console.log('Parsing Padding')
      if (this.panelDisabled) this.selectedElement.styles.padding = ''
      console.log(this.selectedElement.styles.padding)
      if (!this.selectedElement.styles.padding) {
        this.padding['top'] = 0
        this.padding['right'] = 0
        this.padding['left'] = 0
        this.padding['bottom'] = 0
        return
      }
      let positions = ['top', 'right', 'bottom', 'left']
      let elementPaddings = this.selectedElement.styles.padding.split(' ')
      let cleaned = []
      for (let padding of elementPaddings) {
        let pos = padding.indexOf('px')
        if (pos > -1) padding = padding.substring(0, pos)
        cleaned.push(parseInt(padding))
      }
      if (cleaned.length === 4) {
        this.padding.linkAll = cleaned.every((value, i, array) => value === array[0])
        this.padding.linkV = cleaned[0] === cleaned[2]
        this.padding.linkH = cleaned[1] === cleaned[3]
        let i = -1
        while (i++ < positions.length) this.padding[positions[i]] = cleaned[i]
      } else if (cleaned.length === 3) {
        this.padding.linkAll = false
        this.padding.linkV = cleaned[0] === cleaned[2]
        this.padding.linkH = true
        this.padding['top'] = cleaned[0]
        this.padding['right'] = cleaned[1]
        this.padding['left'] = cleaned[1]
        this.padding['bottom'] = cleaned[2]
      } else if (cleaned.length === 2) {
        this.padding.linkAll = false
        this.padding.linkV = true
        this.padding.linkH = true
        this.padding['top'] = cleaned[0]
        this.padding['bottom'] = cleaned[0]
        this.padding['right'] = cleaned[1]
        this.padding['left'] = cleaned[1]
      } else if (cleaned.length === 1) {
        this.padding.linkAll = true
        for (let pos of positions) this.padding[pos] = cleaned[0]
      }
      console.log(cleaned)
    },
    linkPaddings (mode) {
      if (mode === 'A') {
        this.padding.linkAll = !this.padding.linkAll
        if (this.padding.linkAll) {
          this.padding.linkV = true
          this.padding.linkH = true
          this.padding.top = this.padding[this.padding.lastChanged]
          this.padding.bottom = this.padding[this.padding.lastChanged]
          this.padding.left = this.padding[this.padding.lastChanged]
          this.padding.right = this.padding[this.padding.lastChanged]
        }
        return true
      } else if (mode === 'V') {
        console.log(this.padding.lastChanged)
        this.padding.linkV = !this.padding.linkV
        if (['top', 'bottom'].includes(this.padding.lastChanged) && this.padding.linkV) {
          this.padding.top = this.padding[this.padding.lastChanged]
          this.padding.bottom = this.padding[this.padding.lastChanged]
        }
      } else {
        this.padding.linkH = !this.padding.linkH
        if (['left', 'right'].includes(this.padding.lastChanged) && this.padding.linkH) {
          this.padding.left = this.padding[this.padding.lastChanged]
          this.padding.right = this.padding[this.padding.lastChanged]
        }
      }
      if (!this.padding.linkV || !this.padding.linkH) this.padding.linkAll = false
    }
  },
  updated () {
    // if (!this.panelDisabled) this.parsePadding()
  }
}
</script>
<style lang="stylus">
  .padding-row input {
    max-width 40px
  }
</style>
