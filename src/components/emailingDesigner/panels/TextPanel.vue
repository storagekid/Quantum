<template>
  <side-panel
    panelName="Text"
    :panelDisabled="panelDisabled"
    v-if="selectedElement"
    >
    <template v-slot:panel-content>
      <custom-select
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'font-family', type: { model: 'font-family', default: { text: 'Selecciona Fuentes'} }}"
        :clearable='true'
        :emitValue="true"
        multiple
        :initValue="styles['fontFamilies']"
        :sourceOptions="fullFontSets"
        @updated="updateCustomSelect('styles.fontFamilies', $event)"
        >
      </custom-select>
      <q-separator />
      <div class="row">
        <q-input dense type="text" label="Font Size" v-model="selectedElement.styles['font-size']" class="col"></q-input>
        <q-input dense type="text" label="Line Height" v-model="selectedElement.styles['line-height']" class="col"></q-input>
        <custom-select
          :dense="true"
          :hide-bottom-space="true"
          :field="{name: 'font-weight', type: { model: 'font-weight', default: { text: 'Font Weight'} }}"
          :clearable='true'
          :emitValue="true"
          :initValue="selectedElement.styles['font-weight']"
          :sourceOptions="[{label: 'lighter', value: 'lighter'}, {label: 'normal', value: 'normal'}, {label: 'bold', value: 'bold'}, {label: 'bolder', value: 'bolder'}]"
          @updated="updateCustomSelect('selectedElement.styles.font-weight', $event)"
          >
        </custom-select>
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'
import CustomSelect from '../../form/customSelect'
import { customSelectMixins } from '../../../mixins/customSelectMixins'

export default {
  name: 'TextPanel',
  props: ['selectedElement', 'fullFontSets'],
  components: { SidePanel, CustomSelect },
  mixins: [ customSelectMixins ],
  data () {
    return {
      styles: {
        'fontFamilies': []
      }
    }
  },
  watch: {
    'styles.fontFamilies' () {
      this.selectedElement.styles['font-family'] = this.fontFamilyParsed
    }
  },
  computed: {
    fontFamilyParsed () {
      let fontFamilies = ''
      if (!this.styles['fontFamilies'].length) return fontFamilies
      else {
        let round = 1
        for (let font of this.styles['fontFamilies']) {
          fontFamilies += font
          if (round < this.styles['fontFamilies'].length) fontFamilies += ', '
          round++
        }
        return fontFamilies
      }
    },
    panelDisabled () {
      if (!this.selectedElement) return true
      let approvedNodes = ['p', 'span', 'font', 'td', 'table']
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
