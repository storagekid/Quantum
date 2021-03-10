<template>
  <side-panel
    panelName="Advanced Text"
    :panelDisabled="panelDisabled"
    v-if="selectedElement"
    >
    <template v-slot:panel-content>
      <div class="">
        <q-editor
          ref="advEditor"
          v-model="selectedElement.content"
          dense
          flat
          toolbar-text-color="primary"
          toolbar-toggle-color="warning"
          toolbar-bg="secondary"
          :toolbar="[
            ['customFormat'],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'link', 'custom_btn'],
            ['fullscreen'],
            [
              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana'
                ]
              },
              'removeFormat'
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
            ['viewsource']
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana'
          }"
          :definitions="{
            customFormat: {
              tip: 'Add Custom Format',
              icon: 'create',
              label: 'Custom Format',
              handler: addCustomCSS
            }
          }"
        />
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'AdvancedTextPanel',
  props: ['selectedElement'],
  components: { SidePanel },
  data () {
    return {}
  },
  computed: {
    panelDisabled () {
      if (!this.selectedElement) return true
      let approvedNodes = ['span', 'p', 'font', 'a']
      if (approvedNodes.includes(this.selectedElement.name.toLowerCase())) return false
      return true
    }
  },
  methods: {
    addCustomCSS (e) {
      let text = document.getSelection().toString()
      if (!text) return
      // console.log(this.$refs.advEditor)
      let start = `<span style="font-family:'BankiaBold','Source Sans Pro',Tahoma,Verdana,Segoe,sans-serif; font-weight: 600;">`
      let end = '</span>'
      this.$refs.advEditor.runCmd('insertHTML', start + text + end)
    }
  }
}
</script>
