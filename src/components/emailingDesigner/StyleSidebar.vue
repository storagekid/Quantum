<template>
  <form>
    <div class="items-start q-gutter-sm">
      <!-- Email Body Styles BEGIN-->
      <email-body-panel :emailing="emailing" :fullFontSets="fullFontSets">
      </email-body-panel>
      <!-- Email Body Styles END-->
      <!-- Attributes Styles BEGIN-->
      <attributes-panel :selectedElement="selectedElement">
      </attributes-panel>
      <!-- Attributes Styles END-->
      <!-- Color Styles BEGIN-->
      <color-panel :selectedElement="selectedElement">
      </color-panel>
      <!-- Color Styles END-->
      <!-- SizeAndSpace Styles BEGIN-->
      <size-and-space-panel :selectedElement="selectedElement">
      </size-and-space-panel>
      <!-- SizeAndSpace Styles END-->
      <!-- Text Styles BEGIN-->
      <text-panel :selectedElement="selectedElement" :fullFontSets="fullFontSets">
      </text-panel>
      <!-- Text Styles END-->
      <!-- Iamge Styles BEGIN-->
      <image-panel :selectedElement="selectedElement">
      </image-panel>
      <!-- Iamge Styles END-->
      <!-- Adv Content BEGIN-->
      <advanced-content-panel :selectedElement="selectedElement" :contentNodeSelected="contentNodeSelected">
      </advanced-content-panel>
      <!-- Adv Content Styles END-->
      <!-- WYSIWYG BEGIN-->
      <advanced-text-panel :selectedElement="selectedElement">
      </advanced-text-panel>
      <!-- WYSIWYG Styles END-->
    </div>
    <!-- <q-list v-else>
      <p>{{ emailing.design.mainRows[rowSelected].name }}</p>
      <q-expansion-item
        expand-separator
        label="Content"
        >
        <q-input dense type="text" label="Text Body" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.textBody" v-if="emailing.design.mainRows[rowSelected].data.textBody"></q-input>
      </q-expansion-item>
      <q-item dense v-for="(prop, key, index) in emailing.design.mainRows[rowSelected].data.styles" :key="'d' + index">
        <q-input dense type="text" label="Text Color" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-if="key === 'color'"></q-input>
        <q-input dense type="text" label="Background Color" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'background-color'"></q-input>
        <q-input dense type="text" label="Padding" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'padding'"></q-input>
        <q-input dense type="text" label="Margin" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'margin'"></q-input>
        <q-input dense type="text" label="Text Align" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'text-align'"></q-input>
        <q-input dense type="text" label="Vertical Align" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'vertical-align'"></q-input>
        <q-input dense type="text" label="Font Family" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'font-family'"></q-input>
        <q-input dense type="text" label="Font Size" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'font-size'"></q-input>
        <q-input dense type="text" label="Font Weight" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'font-weight'"></q-input>
        <q-input dense type="text" label="Line Height" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'line-height'"></q-input>
        <q-toggle
          dense
          class="full-width"
          :label="`Image Source ${emailing.design.mainRows[rowSelected].data.styles[key].toUpperCase()}`"
          v-model="emailing.design.mainRows[rowSelected].data.styles[key]"
          false-value="local"
          true-value="remote"
          v-else-if="key === 'image-source'"
          >
        </q-toggle>
        <q-input dense type="text" label="Local Image" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'local-url'"></q-input>
        <q-input dense type="text" label="Remote Image" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'remote-url'"></q-input>
        <q-input dense type="text" label="Image Alt" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'image-alt'"></q-input>
        <q-input dense type="text" label="Image Title" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'image-title'"></q-input>
        <q-input dense type="text" label="Image Width" class="full-width" v-model="emailing.design.mainRows[rowSelected].data.styles[key]" v-else-if="key === 'width'"></q-input>
        <div v-else class="text-red">{{ key }} : {{ prop }}</div>
      </q-item>
    </q-list> -->
  </form>
</template>

<script>
import EmailBodyPanel from './panels/EmailBodyPanel'
import AttributesPanel from './panels/AttributesPanel'
import ColorPanel from './panels/ColorPanel'
import TextPanel from './panels/TextPanel'
import SizeAndSpacePanel from './panels/SizeAndSpacePanel'
import ImagePanel from './panels/ImagePanel'
import AdvancedContentPanel from './panels/AdvancedContentPanel'
import AdvancedTextPanel from './panels/AdvancedTextPanel'

export default {
  name: 'style-sidebar',
  props: [ 'emailing', 'rowSelected', 'selectedElement', 'contentNodeSelected', 'userFonts' ],
  components: { EmailBodyPanel, AttributesPanel, ColorPanel, SizeAndSpacePanel, TextPanel, ImagePanel, AdvancedContentPanel, AdvancedTextPanel },
  data () {
    return {
      panelExpanded: true,
      panelGroups: ['Size', 'Color', 'Text', 'Image', 'Spacing', 'Alignment'],
      stylePanels: {
        'text-body': {
          name: 'text-body',
          label: 'Text Body',
          group: 'Text',
          type: 'wysiwyg'
        },
        color: {
          name: 'color',
          label: 'Text Color',
          group: 'Color',
          type: 'color-pickup'
        }
      },
      fontFamilies: [
        { label: 'Arial', value: 'Arial' },
        { label: 'Courier', value: 'Courier' },
        { label: 'Sans-serif', value: 'sans-serif' },
        { label: 'Verdana', value: 'Verdana' }
      ]
    }
  },
  computed: {
    fullFontSets () {
      let fonts = []
      for (let userFont of this.userFonts) {
        fonts = fonts.concat(userFont.names)
      }
      fonts = fonts.concat(this.fontFamilies)
      return fonts
    }
    // parsedPanels () {
    //   const panels = { groups: {} }
    //   if (!this.rowSelected) return panels
    //   const stylesInRow = Object.keys(this.emailing.design.mainRows[this.rowSelected].data.styles)
    //   for (let style in this.stylePanels) {
    //     if (stylesInRow.includes(style)) {
    //       if (!panels.groups[this.stylePanels[style].group]) panels.groups[this.stylePanels[style].group] = []
    //       panels.groups[this.stylePanels[style].group].push(this.stylePanels[style])
    //     }
    //   }
    //   return panels
    // }
  },
  methods: {
    fontFamilySelected (payload) {
      // console.log(payload)
    }
  }
}
</script>
