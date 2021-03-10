<template>
  <side-panel
    panelName="Color"
    :panelDisabled="panelDisabled"
    v-if="selectedElement"
    >
    <template v-slot:panel-content>
      <q-input
          filled
          label="Background"
          v-model="selectedElement.styles['background-color']"
          :rules="['anyColor']"
          class="full-width q-pb-none"
          dense
          :readonly="panelDisabled"
          >
          <template v-slot:append>
            <q-btn icon="colorize" class="cursor-pointer q-pa-none" flat dense :disable="panelDisabled">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color v-model="selectedElement.styles['background-color']" :palette="[ '#b9c800']"/>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>
        <q-separator />
        <q-input
          filled
          label="Text Color"
          v-model="selectedElement.styles['color']"
          :rules="['anyColor']"
          class="full-width q-pb-none"
          dense
          >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color v-model="selectedElement.styles['color']" :palette="[ '#b9c800']"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'ColorPanel',
  props: ['selectedElement'],
  components: { SidePanel },
  data () {
    return {
    }
  },
  computed: {
    panelDisabled () {
      let approvedNodes = ['td', 'p', 'a', 'table']
      if (approvedNodes.includes(this.selectedElement.name.toLowerCase())) return false
      return true
    }
  }
}
</script>
