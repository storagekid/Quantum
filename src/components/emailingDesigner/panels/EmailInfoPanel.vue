<template>
  <side-panel
    panelName="Email Info"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
      <q-input dense type="text" label="Name" v-model="emailing.name"></q-input>
      <q-separator />
      <q-input dense type="text" label="Description" v-model="emailing.description"></q-input>
      <q-separator />
      <custom-select
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'companies', type: { model: 'companies', default: { text: 'Selecciona una Empresa'} }}"
        :clearable='true'
        :initValue="emailing.company_id"
        @updated="updateCustomSelect('emailing.company_id', $event)"
        >
      </custom-select>
      <q-separator />
      <custom-select
        :dense="true"
        :hide-bottom-space="true"
        :field="{name: 'campaigns', type: { model: 'campaigns', default: { text: 'Selecciona una Campaña'} }}"
        :clearable='true'
        :initValue="emailing.campaign_id"
        @updated="updateCustomSelect('emailing.campaign_id', $event)"
        >
      </custom-select>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'
import CustomSelect from '../../../components/form/customSelect'
import { customSelectMixins } from '../../../mixins/customSelectMixins'

export default {
  name: 'EmailInfoPanel',
  props: ['emailing'],
  components: { SidePanel, CustomSelect },
  mixins: [ customSelectMixins ],
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
<style lang="stylus">
</style>
