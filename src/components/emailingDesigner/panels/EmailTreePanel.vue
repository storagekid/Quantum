<template>
  <side-panel
    panelName="Email Tree"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
      <div id="nodeTreeHolder" class="q-pa-xs" style="overflow: auto">
        <q-tree
          color="primary"
          :nodes="treeNodes"
          :selected.sync="localTreeNodeSelected"
          filter="msHack"
          :filter-method="myFilterMethod"
          node-key="key"
          ref="nodeTree"
        />
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'EmailTreePanel',
  props: ['selectedElement', 'rowSelected', 'treeNodeSelected', 'emailing'],
  components: { SidePanel },
  data () {
    return {
      localTreeNodeSelected: null
    }
  },
  watch: {
    treeNodeSelected () {
      if (this.localTreeNodeSelected !== this.treeNodeSelected) this.localTreeNodeSelected = this.treeNodeSelected
      if (!this.treeNodeSelected) return
      if (this.treeNodeSelected.length < 2) return
      this.$refs.nodeTree.collapseAll()
      this.$refs.nodeTree.setExpanded(this.treeNodeSelected[0], true)
      if (this.treeNodeSelected.length > 1) {
        let length = 3
        while (this.treeNodeSelected.length > length) {
          let lastExpandable = this.treeNodeSelected.substring(0, length)
          this.$refs.nodeTree.setExpanded(lastExpandable, true)
          length += 2
        }
      }
    },
    localTreeNodeSelected () {
      this.$emit('treeNodeSelected', this.localTreeNodeSelected)
    }
  },
  computed: {
    panelDisabled () {
      return false
    },
    treeNodes () {
      let nodes = []
      if (!this.emailing.design.mainRows.length) return nodes
      else {
        let level = 0
        // let elementCount = 0
        for (let row of this.emailing.design.mainRows) {
          let node = {
            label: row.name.toUpperCase(),
            key: level.toString(),
            // icon: 'linear_scale',
            avatar: '',
            children: []
          }
          // elementCount++
          if (row.children.length) {
            let children = []
            let childCount = 0
            for (let child of row.children) {
              if (child.classes.length) {
                if (child.classes[0].indexOf('comment') > -1) {
                }
              }
              let childNode = this.createTreeChild(child, level, childCount)
              children.push(childNode)
              childCount++
            }
            node.children = children
          }
          nodes.push(node)
          level++
        }
      }
      return nodes
    }
  },
  methods: {
    myFilterMethod (node, filter) {
      return node.label.indexOf('msHack') === -1
    },
    createTreeChild (node, level, childCount, disabled = false) {
      // console.log(node.name)
      // level++
      level = level + '-' + childCount
      let childNode = {
        label: disabled ? 'msHack' : node.name.toUpperCase(),
        key: level,
        avatar: '',
        // icon: 'linear_scale',
        children: [],
        disabled: disabled
      }
      if (node.children.length) {
        // console.log('Has Children')
        let children = []
        let newChildLEvel = 0
        for (let child of node.children) {
          let disabled = false
          if (child.classes.length) if (child.classes[0].indexOf('comment') > -1) disabled = true
          let childNodeChild = this.createTreeChild(child, level, newChildLEvel, disabled)
          children.push(childNodeChild)
          newChildLEvel++
        }
        childNode.children = children
      }
      return childNode
    }
  },
  updated () {
  }
}
</script>
<style lang="stylus">
  #nodeTreeHolder {
    .q-tree__node-header-content > div {
      font-size .8em
      font-weight bold
      color $accent
    }
    .q-tree__node--parent > .q-tree__node-header:before {
      left: -10px
    }
    .q-tree__node-header:before {
      width: 25px;
      left: -30px;
    }
    .q-tree__node:after {
      left: -8px
    }
    .q-tree__children {
      padding-left 20px
    }
    .q-tree__node--selected {
       .q-tree__node-header-content > div {
        color $primary
        font-style italic
      }
    }
  }
</style>
