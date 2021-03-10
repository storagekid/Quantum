<template>
  <side-panel
    panelName="Advanced Content"
    :panelDisabled="panelDisabled"
    v-if="selectedElement && contentNodeSelected"
    >
    <template v-slot:panel-content>
      <q-input dense type="number" label="Start Position" v-model="contentNodeSelected.openTagPos"></q-input>
      <div> {{openTag.tag}} </div>
      <q-separator />
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'
import { customSelectMixins } from '../../../mixins/customSelectMixins'

export default {
  name: 'AdvancedContentPanel',
  props: ['selectedElement', 'contentNodeSelected'],
  components: { SidePanel },
  mixins: [ customSelectMixins ],
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    openTag () {
      let opentag = this.selectedElement.content.substring(this.contentNodeSelected.openTagPos)
      let completeTag = opentag.substring(0, (opentag.indexOf('>') + 1))
      return {
        tag: completeTag,
        length: completeTag.length
      }
    },
    panelDisabled () {
      if (!this.contentNodeSelected) return true
      let approvedNodes = ['p', 'span', 'font']
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
<style lang="stylus">
  .padding-row input {
    max-width 40px
  }
</style>
