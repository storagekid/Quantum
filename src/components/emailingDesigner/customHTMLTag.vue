<template>
    <component :is="data.name" :id="nodeKey" v-bind="data.attributes" @click.stop="selectElement" @mouseover.stop="touchElement" ref="customTag" :style="data.styles" :class="classes"  v-html="data.content" v-if="data.content && !data.children.length">
    </component>
    <component :is="data.name" :id="nodeKey" v-bind="data.attributes" @click.stop="selectElement" @mouseover.stop="touchElement" ref="customTag" :style="data.styles" :class="classes" v-else>
      <template v-if="data.children.length" ref="firstChild">
        <custom-html-tag v-for="(child, index) in data.children" :key="index" :data="child" :nodeKey="nodeKey + '-' + index" :treeNodeSelected="treeNodeSelected" @selectElement="propagateSelection"></custom-html-tag>
      </template>
      <template v-else-if="data.name === 'tr'">
        <td class="empty-row">
          EMPTY ROW {{ nodeKey }}
        </td>
      </template>
    </component>
</template>

<script>
import CustomHtmlTag from './customHTMLTag'

export default {
  name: 'customHtmlTag',
  props: [ 'data', 'nodeKey', 'treeNodeSelected' ],
  components: { CustomHtmlTag },
  data () {
    return {}
  },
  // watch: {
  //   'data.content' () {
  //     this.parseContent()
  //   }
  // },
  computed: {
    tag () {
      return '<p>' + this.data.content + '</p>'
    },
    classes () {
      if (this.treeNodeSelected[2] === this.nodeKey[2]) {
        let classes = this.data.classes.concat(['selected'])
        return classes
      }
      return this.data.classes
    }
  },
  methods: {
    loadMsComments () {
      for (let node of this.data.msHacks.nodes) {
        const comment = document.createComment(node.text)
        let nodeToChange = document.getElementsByClassName(node.place)[0]
        // console.log(nodeToChange)
        this.$refs.customTag.replaceChild(comment, nodeToChange)
      }
    },
    selectElement () {
      // console.log('Custom Tag Clicked')
      this.$emit('selectElement', this.nodeKey)
    },
    propagateSelection (payload) {
      // console.log('propagation')
      this.$emit('selectElement', payload)
    },
    touchElement () {
      // console.log('Custom Tag Touched')
    }
  },
  mounted () {
    // console.log('Updated in custom tag')
    // console.log(this.$refs)
    // if (this.data.msHacks) this.loadMsComments()
  }
}
</script>
