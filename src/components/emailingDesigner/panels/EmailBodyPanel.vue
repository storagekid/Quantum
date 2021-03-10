<template>
  <side-panel
    panelName="Email Body"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
      <q-input
        filled
        label="Full Background"
        v-model="emailing.design['body-background-color']"
        :rules="['anyColor']"
        class="full-width q-pb-none"
        dense
        >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="emailing.design['body-background-color']" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'
import { customSelectMixins } from '../../../mixins/customSelectMixins'

export default {
  name: 'EmailBodyPanel',
  props: ['emailing', 'fullFontSets', 'emailWidth'],
  components: { SidePanel },
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
      this.emailing.design.styles['font-family'] = this.fontFamilyParsed
    },
    'emailing.id' () {
      this.styles.fontFamilies = []
      this.buildFontString()
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
      return false
    }
  },
  methods: {
    buildFontString () {
      console.log('Building Fonts')
      console.log(this.emailing.design.styles['font-family'])
      if (this.emailing.design.styles['font-family']) {
        let families = this.emailing.design.styles['font-family'].split(',')
        if (families.length) {
          if (families.length === 1) this.styles.fontFamilies.push(families)
          else {
            for (let family of families) {
              this.styles.fontFamilies.push(family.trim())
            }
          }
        }
      }
    }
  },
  mounted () {
    this.buildFontString()
  }
}
</script>
