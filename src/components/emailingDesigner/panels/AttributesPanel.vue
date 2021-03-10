<template>
  <side-panel
    panelName="Attributes"
    :panelDisabled="panelDisabled"
    v-if="selectedElement"
    >
    <template v-slot:panel-content v-if="!panelDisabled">
      <template v-for="(attribute, key, index) in selectedElement.attributes">
        <q-input dense type="text" :label="key[0].toUpperCase() + key.slice(1)" v-model="selectedElement.attributes[key]" :key="'attr-i-' + index"></q-input>
        <q-separator :key="'attr-s-' + index"/>
      </template>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'AttributesPanel',
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
  },
  computed: {
    panelDisabled () {
      if (!this.selectedElement) return true
      if (!Object.keys(this.selectedElement.attributes).length) return true
      let approvedNodes = ['td', 'img', 'table', 'a']
      if (approvedNodes.includes(this.selectedElement.name.toLowerCase())) return false
      return true
    }
  },
  methods: {
  },
  updated () {
  }
}
</script>
