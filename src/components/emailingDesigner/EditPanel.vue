<template>
  <div class="q-gutter-sm">
    <email-info-panel
      :emailing="emailing"
      >
    </email-info-panel>
    <email-options-panel
      :emailing="emailing"
      >
    </email-options-panel>
    <email-tree-panel
      :emailing="emailing"
      :rowSelected="rowSelected"
      :selectedElement="selectedElement"
      :treeNodeSelected="treeNodeSelected"
      @treeNodeSelected="sendTreeNodeSelected"
      >
    </email-tree-panel>
    <element-tree-panel
      :emailing="emailing"
      :rowSelected="rowSelected"
      :selectedElement="selectedElement"
      :treeNodeSelected="treeNodeSelected"
      @contentElementSelected="sendContentNodeSelected"
      >
    </element-tree-panel>
  </div>
</template>

<script>
import { EmailDesignerMixin } from '../../mixins/emailDesignerMixin'
import EmailInfoPanel from './panels/EmailInfoPanel'
import EmailOptionsPanel from './panels/EmailOptionsPanel'
import EmailTreePanel from './panels/EmailTreePanel'
import ElementTreePanel from './panels/ElementTreePanel'

export default {
  name: 'edit-panel',
  props: [ 'emailing', 'rowSelected', 'selectedElement', 'treeNodeSelected', 'emailWidth' ],
  components: { EmailTreePanel, EmailOptionsPanel, ElementTreePanel, EmailInfoPanel },
  mixins: [ EmailDesignerMixin ],
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    sendTreeNodeSelected (payload) {
      this.$emit('treeNodeSelected', payload)
    },
    sendContentNodeSelected (payload) {
      this.$emit('contentNodeSelected', payload)
    }
  }
}
</script>
