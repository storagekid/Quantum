<template>
  <body id="email-body" width="100%" :style="bodyStyles" @click="clearSelections" :ref="'emailDesign'">
    <center role="article" aria-roledescription="email" lang="en" :style="centerStyles" ref="center">
      <div id="msComment-1-1"></div>

      <!-- Visually Hidden Preheader Text : BEGIN -->
      <div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
          (Optional) This text will appear in the inbox preview, but not the email body. It can be used to supplement the email subject line or even summarize the email's contents. Extended text preheaders (~490 characters) seems like a better UX for anyone using a screenreader or voice-command apps like Siri to dictate the contents of an email. If this text is not included, email clients will automatically populate it using the text (including image alt text) at the start of the email's body.
      </div>
      <!-- Visually Hidden Preheader Text : END -->

      <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
      <!-- Preview Text Spacing Hack : BEGIN -->
      <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
          &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
      </div>
      <!-- Preview Text Spacing Hack : END -->
      <div :style="'max-width:' + emailWidth + 'px; margin: 0 auto;'" class="email-container" ref="mainDiv">
        <div id="msComment-2-1"></div>
        <!-- NEW Email Body : BEGIN -->
        <template v-if="design.mainRows.length">
          <template v-if="design.mainRows.length > 1 || design.mainRows[0].children.length">
            <template v-for="(mainRow, mainRowIndex) in design.mainRows">
              <custom-html-tag :key="mainRowIndex" :data="mainRow" :nodeKey="mainRowIndex" :treeNodeSelected="treeNodeSelected" @selectElement="selectElement"></custom-html-tag>
            </template>
          </template>
          <template v-else>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
              <tr>
                <td class="empty-email">BLANK EMAIL</td>
              </tr>
            </table>
          </template>
        </template>
        <!-- NEW Email Body : END -->

        <!-- Email Body : BEGIN -->
        <!-- <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" :width="emailWidth" :style="design.styles" class="email-container">
          <template v-if="design.rows.length">
            <template v-for="(row, rowIndex) in design.rows">
              <tr :key="rowIndex" @click.stop="selectRow(rowIndex)" :style="mainRowStyles(rowIndex)">
                <div class="helper" v-if="selectedElement === ('r-' + rowIndex)">TR</div>
                <td class="empty-row" v-if="!row.preset && !row.children.length">
                  EMPTY ROW {{ rowIndex }}
                </td>
                <template v-for="(child, index) in row.children">
                  <custom-html-tag :key="index" :data="child" :nodeKey="rowIndex + '-' + index" @selectElement="selectElement"></custom-html-tag>
                </template>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td class="empty-email">BLANK EMAIL</td>
            </tr>
          </template>
        </table> -->
        <!-- Email Body : END -->

        <div id="msComment-2-2"></div>
      </div>
      <div id="msComment-1-2"></div>
    </center>
  </body>
</template>

<script>
import CustomHtmlTag from './customHTMLTag'

export default {
  name: 'designer',
  comments: true,
  props: ['design', 'rowSelected', 'selectedElement', 'emailWidth', 'treeNodeSelected'],
  components: { CustomHtmlTag },
  data () {
    return {}
  },
  computed: {
    bodyStyles () {
      return {
        margin: '0',
        padding: '0 !important',
        'mso-line-height-rule': 'exactly',
        'background-color': this.design['body-background-color']
      }
    },
    centerStyles () {
      return {
        width: '100%',
        'background-color': this.design['body-background-color']
      }
    },
    tableStyles () {
      return {
        'background-color': this.design.styles['background-color'],
        margin: 'auto'
      }
    }
  },
  methods: {
    loadMsComments () {
      const openComment1 = document.createComment(
        `<!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" :style="width: 100%, background-color: ${this.design['body-background-color']}">
        <tr>
        <td>
        <![endif]-->`
      )
      const closeComment1 = document.createComment(
        `<!--[if mso | IE]>
        </td>
        </tr>
        </table>
        <![endif]-->`
      )
      let nodeToChange = document.getElementById('msComment-1-1')
      this.$refs.center.replaceChild(openComment1, nodeToChange)
      nodeToChange = document.getElementById('msComment-1-2')
      this.$refs.center.replaceChild(closeComment1, nodeToChange)
      const openComment2 = document.createComment(
        `<!--[if mso]>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="${this.emailWidth}">
            <tr>
            <td>
            <![endif]-->`
      )
      const closeComment2 = document.createComment(
        `<!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->`
      )
      nodeToChange = document.getElementById('msComment-2-1')
      this.$refs.mainDiv.replaceChild(openComment2, nodeToChange)
      nodeToChange = document.getElementById('msComment-2-2')
      this.$refs.mainDiv.replaceChild(closeComment2, nodeToChange)
    },
    selectRow (index) {
      this.$emit('rowSelected', index)
    },
    selectElement (payload) {
      this.$emit('elementSelected', payload)
    },
    clearSelections () {
      this.$emit('clearSelections')
    },
    clearSelectedElement () {
      this.$emit('clearSelectedElement')
    },
    elementStyles (element) {
      return {
        outline: this.selectedElement === element ? '2px dotted red' : '',
        width: this.selectedElement === element ? '50%' : '20%',
        height: this.selectedElement === element ? '30px' : '10px'
      }
    },
    mainRowStyles (row) {
      return {
        outline: this.rowSelected === row ? '2px dotted red' : ''
      }
    }
  },
  mounted () {
  },
  updated () {
  }
}
</script>

<style lang="stylus">
  .helper {
    position: absolute;
    display: block;
    padding: 5px;
    background-color: aqua;
    color: blue;
    font-size: .8em;
    font-style: italic;
  }
  .selected {
    outline: 2px dotted red
  }
  .empty-email {
    width: 100%;
    background-color: #FFFFFF;
    vertical-align: middle;
    text-align center
    height 200px
    font-size 32px
    color $primary
    font-weight 100
  }
  .empty-row {
    width 100%
    height 50px
    text-align center
    color $primary
    background-color $secondary
  }
    /* Media Queries */
  @media screen and (max-width: 480px) {

      /* What it does: Forces table cells into full-width rows. */
      .stack-column,
      .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
      }
      /* And center justify these ones. */
      .stack-column-center {
          text-align: center !important;
      }

      /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
      .center-on-narrow {
          text-align: center !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
      }
      table.center-on-narrow {
          display: inline-block !important;
      }

      /* What it does: Adjust typography on small screens to improve readability */
      .email-container p {
          font-size: 17px !important;
      }
  }
</style>
