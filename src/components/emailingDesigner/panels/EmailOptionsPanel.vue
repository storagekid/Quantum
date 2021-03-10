<template>
  <side-panel
    panelName="Email Options"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
      <q-input dense type="text" label="Title" v-model="emailing.design.options.title"></q-input>
      <q-input dense type="text" label="Preheader" v-model="emailing.design.options.preheaderText" v-show="emailing.design.options.hacks.preheader"></q-input>
      <div class="text-bold full-width bg-secondary text-primary text-center">Style Cascade</div>
      <div class="q-pa-xs">
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.cascadeStyles['background-color']"
          label="Background Color"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
        <q-separator />
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.cascadeStyles['font-family']"
          label="Font Families"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
        <q-separator />
      </div>
      <div class="text-bold full-width bg-secondary text-primary text-center">Hacks</div>
      <div class="q-pa-xs">
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.hacks.mso"
          label="MS Hacks"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
        <q-separator />
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.hacks.preheader"
          label="Preheader"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
        <q-separator />
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.hacks.hasMirror"
          label="Has Mirror"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
        <q-separator />
        <q-toggle
          dense
          size="sm"
          v-model="emailing.design.options.hacks.comments"
          label="Load Comments"
          checked-icon="check"
          color="primary"
          unchecked-icon="clear"
        />
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'
// import CustomSelect from '../../../components/form/customSelect'
// import { customSelectMixins } from '../../../mixins/customSelectMixins'

export default {
  name: 'EmailOptionsPanel',
  props: ['emailing'],
  components: { SidePanel },
  // mixins: [ customSelectMixins ],
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    panelDisabled () {
      return false
    }
  },
  methods: {
  }
}
</script>
