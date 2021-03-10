<template>
  <side-panel
    panelName="Image"
    v-if="selectedElement"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
        <q-input dense type="text" label="Image Source" v-model="imgSrc"></q-input>
        <q-separator />
        <q-input dense type="text" label="Image Width" v-model="imgWidth"></q-input>
        <q-separator />
        <q-input dense type="text" label="Image Height" v-model="imgHeight"></q-input>
        <q-separator />
        <q-input dense type="text" label="Alt Text" v-model="imgAlt"></q-input>
        <q-separator />
        <q-input dense type="text" label="Title Text" v-model="imgTitle"></q-input>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'ImagerPanel',
  props: ['selectedElement'],
  components: { SidePanel },
  data () {
    return {
    }
  },
  computed: {
    imgSrc: {
      get () {
        if (this.panelDisabled) return ''
        return this.selectedElement.attributes.src
      },
      set (newValue) {
        // https://www.bankia.es/es/estaticos/Portal-unico/imagenes/20201021/main-picture.jpg
        // if (this.panelDisabled) return ''
        // fetch('https://cors-anywhere.herokuapp.com/' + newValue).then(response => response.blob()).then(response => {
        //   // var objectURL = URL.createObjectURL(response)
        //   // src.src = objectURL
        //   let src = this.selectedElement.attributes
        //   console.log('HERE')
        //   console.log(this.selectedElement)
        //   var reader = new FileReader()
        //   reader.readAsDataURL(response)
        //   reader.onloadend = function () {
        //     var base64data = reader.result
        //     console.log(base64data)
        //     src.src = base64data
        //   }
        // })
        // let src = this.selectedElement.attributes.src
        // src.src = newValue
      }
    },
    imgAlt: {
      get () {
        if (this.panelDisabled) return ''
        return this.selectedElement.attributes.alt
      },
      set (newValue) {
        if (this.panelDisabled) return ''
        let alt = this.selectedElement.attributes.alt
        alt.alt = newValue
      }
    },
    imgTitle: {
      get () {
        if (this.panelDisabled) return ''
        return this.selectedElement.attributes.title
      },
      set (newValue) {
        if (this.panelDisabled) return ''
        let title = this.selectedElement.attributes.title
        title.title = newValue
      }
    },
    imgWidth: {
      get () {
        if (this.panelDisabled) return ''
        return this.selectedElement.attributes.width
      },
      set (newValue) {
        if (this.panelDisabled) return ''
        let width = this.selectedElement.attributes.width
        width.width = newValue
        this.selectedElement.styles.width = newValue + 'px'
        this.selectedElement.styles['max-width'] = newValue + 'px'
      }
    },
    imgHeight: {
      get () {
        if (this.panelDisabled) return ''
        return this.selectedElement.attributes.height
      },
      set (newValue) {
        if (this.panelDisabled) return ''
        let height = this.selectedElement.attributes.height
        height.height = newValue
        this.selectedElement.styles.height = newValue ? newValue + 'px' : 'auto'
      }
    },
    panelDisabled () {
      if (!this.selectedElement) return true
      let approvedNodes = ['img']
      if (approvedNodes.includes(this.selectedElement.name.toLowerCase())) return false
      return true
    }
  }
}
</script>
