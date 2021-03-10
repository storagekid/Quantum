<template>
  <side-panel
    panelName="Element Tree"
    :panelDisabled="panelDisabled"
    >
    <template v-slot:panel-content>
      <div id="ElementTreeHolder" class="q-pa-xs" style="overflow: auto">
        <q-tree
          color="primary"
          :nodes="elementTags"
          :selected.sync="localTreeNodeSelected"
          node-key="key"
          ref="elementTree"
        />
      </div>
    </template>
  </side-panel>
</template>

<script>
import SidePanel from '../SidePanel'

export default {
  name: 'ElementTreePanel',
  props: ['selectedElement', 'rowSelected', 'emailing', 'treeNodeSelected'],
  components: { SidePanel },
  data () {
    return {
      localTreeNodeSelected: null,
      elementsObject: [],
      nodes: []
    }
  },
  watch: {
    localTreeNodeSelected () {
      let node = this.nodes.filter(i => { return i.id === this.localTreeNodeSelected })[0]
      // console.log(node)
      this.$emit('contentElementSelected', node)
    },
    selectedElement () {
      // this.mutateHTML()
      this.buildTagsObject()
    }
  },
  computed: {
    panelDisabled () {
      return false
    },
    elementTags () {
      if (!this.selectedElement) return []
      if (!this.selectedElement.content) return []
      let level = this.treeNodeSelected
      let childCount = 0
      let container = document.createElement('div')
      container.innerHTML = this.selectedElement.content
      let tags = []
      for (let child of container.children) {
        tags.push(this.getNodeChildren(child, level, childCount))
        childCount++
      }
      return tags
    }
  },
  methods: {
    getNodeChildren (node, level, childLevel) {
      level = level + '-' + childLevel
      node.id = level
      // console.log(node)
      let tag = {
        label: node.tagName,
        key: level.toString(),
        id: level.toString(),
        content: node.outerHTML,
        avatar: '',
        children: []
      }
      if (node.children) {
        let newChildLevel = 0
        for (let child of node.children) {
          tag.children.push(this.getNodeChildren(child, level, newChildLevel))
          newChildLevel++
        }
      }
      return tag
    },
    buildTagsObject () {
      // console.log(this.selectedElement.content.length)
      let tags = []
      for (let i = 0; i < this.elementTags.length; i++) {
        let previousTag = null
        if (i > 0) previousTag = tags[(i - 1)]
        let node = this.buildTagObject(this.elementTags[i], previousTag)
        tags.push(node)
      }
      // for (let tag of this.elementTags) {
      //   let node = this.buildTagObject(tag, 0)
      //   tags.push(node)
      // }
      // console.log(tags)
      this.elementsObject = tags
      return tags
    },
    buildTagObject (tag, previousTag = null, isChild = false) {
      let startPos = previousTag ? previousTag.closeTagPos : 0
      if (isChild) {
        // console.log(isChild)
        // console.log(previousTag.openTagPos)
        startPos = previousTag.openTagPos + previousTag.openTag.length
      }
      let name = tag.label.toLowerCase()
      let node = {
        name: name,
        id: tag.key,
        openTag: '<' + name + ' ',
        closeTag: '</' + name + '>',
        openTagPos: null,
        closeTagPos: null,
        children: []
      }
      node.openTagPos = this.selectedElement.content.indexOf(node.openTag, startPos)
      if (tag.children.length) {
        let children = []
        for (let i = 0; i < tag.children.length; i++) {
          let previousTag = node
          if (i > 0) previousTag = children[(i - 1)]
          let childNode = this.buildTagObject(tag.children[i], previousTag, i === 0)
          children.push(childNode)
        }
        node.children.push(children)
      }
      node.closeTagPos = node.openTagPos + (tag.content.length - node.closeTag.length)
      this.nodes.push(node)
      return node
    },
    mutateHTML () {
      let container = document.createElement('div')
      container.innerHTML = this.selectedElement.content
      // console.log('Mutating')
      // console.log(container)
      let tags = container.getElementsByTagName('*')
      let names = []
      for (let tag in tags) {
        if (tags[tag].tagName) {
          tags[tag].style.color = 'red'
          names.push(tags[tag].tagName)
        }
      }
      this.selectedElement.content = container.innerHTML
      // console.log(this.selectedElement.content)
    }
  },
  mounted () {
    // if (this.selectedElement) this.mutateHTML()
  }
}
</script>
<style lang="stylus">
  #ElementTreeHolder {
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
