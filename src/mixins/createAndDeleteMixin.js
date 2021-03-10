export const CreateAndDeleteMixin = {
  data () {
    return {
    }
  },
  methods: {
    createChildreElement (data) {
      let children = {
        name: data.name || 'div',
        id: data.id || '',
        content: data.content || '',
        msHacks: data.msHacks || null,
        classes: data.classes || [],
        styles: data.styles || {},
        attributes: data.attributes || {},
        children: data.children || [],
        comments: data.comments || {}
      }
      return children
    },
    addMainRow (payload) {
      let row = this.createChildreElement({
        name: 'tr'
      })
      this.emailing.design.mainRows[this.tableSelected].children.push(row)
      // this.selectedRow = this.emailing.design.mainRows[this.selectedRow].children.length - 1
      this.treeNodeSelected = this.tableSelected + '-' + (this.emailing.design.mainRows[this.tableSelected].children.length - 1).toString()
      // this.selectedElement = this.emailing.design.mainRows[this.tableSelected].children[(this.emailing.design.mainRows[this.tableSelected].children.length - 1)]
    },
    addElementHub (name) {
      switch (name) {
        case 'text':
          this.addElementText()
          break
        case 'column':
          this.addElementColumn()
          break
        case 'button':
          this.addButton()
          break
      }
    },
    addElementText () {
      let element = this.createChildreElement({
        name: 'p',
        styles: this.stylesTagBuilder(),
        content: 'Voluptate in deserunt culpa cupidatat. Exercitation eiusmod fugiat officia id anim exercitation et ut sit. Laboris aute esse enim quis cillum labore cillum pariatur elit incididunt. Non sunt irure nostrud laboris pariatur laborum Lorem elit laboris. Voluptate excepteur officia ad deserunt officia nostrud aliqua.'
      })
      this.addElement(element)
    },
    addElementColumn () {
      let element = this.createChildreElement({
        name: 'td',
        classes: ['content-box'],
        styles: this.stylesTagBuilder(),
        attributes: this.attributesObjectBuilder('td', { valign: 'top' }),
        content: 'Empty Column'
      })
      this.addElement(element)
    },
    addButton () {
      let element = this.createChildreElement({
        name: 'table',
        styles: this.stylesTagBuilder({ 'margin': 'auto' }),
        attributes: this.attributesObjectBuilder('table', {
          'align': 'center', 'role': 'presentation', 'cellspacing': 0, 'cellpadding': 0, 'border': 0, 'width': ''
        }),
        children: [
          this.createChildreElement({
            name: 'tr',
            children: [
              this.createChildreElement({
                name: 'td',
                styles: this.stylesTagBuilder({ 'border-radius': '6px', 'background-color': '#888888' }),
                classes: ['button-td', 'button-td-primary'],
                children: [
                  this.createChildreElement({
                    name: 'a',
                    classes: ['button-a', 'button-a-primary'],
                    attributes: this.attributesObjectBuilder('a'),
                    styles: this.stylesTagBuilder({ 'background-color': '#888888', 'border': '1px solid #CCCCCC', 'font-family': 'sans-serif', 'font-size': '15px', 'line-height': '15px', 'text-decoration': 'none', 'padding': '13px 17px', 'color': '#ffffff', 'display': 'block', 'border-radius': '6px' }),
                    content: 'EMPTY BUTTON'
                  })
                ]
              })
            ]
          })
        ]
      })
      this.addElement(element)
    },
    addCleanSpace () {
      let element = this.createChildreElement({
        name: 'td',
        content: '&nbsp',
        attributes: this.attributesObjectBuilder('img', { 'aria-hidden': 'true', height: 40 }),
        styles: this.stylesTagBuilder({ 'font-size': '0px', 'line-height': '0px' })
      })
      this.addPreset(element)
    },
    addImageHero () {
      let element = this.createChildreElement({
        name: 'td',
        styles: this.stylesTagBuilder(),
        children: [
          this.createChildreElement({
            name: 'img',
            styles: this.stylesTagBuilder({
              width: '100%',
              'max-width': this.emailWidth + 'px',
              height: 'auto',
              margin: 'auto',
              display: 'block'
            }),
            classes: ['g-img'],
            attributes: this.attributesObjectBuilder('img', {
              src: 'http://www.storagekid.com/mozodealmacen/images/BK_BBP_InversionAlternativaDiversificada/main_info.gif',
              width: this.emailWidth
            })
          })
        ]
      })
      this.addPreset(element)
    },
    addPresetEvenColumns (columnNumber) {
      let element = this.createChildreElement({
        name: 'td',
        styles: this.stylesTagBuilder(),
        attributes: this.attributesObjectBuilder('td'),
        children: [
          this.createChildreElement({
            name: 'table',
            styles: this.stylesTagBuilder(),
            attributes: this.attributesObjectBuilder('table', { width: '100%', role: 'presentation', cellspacing: '0', cellpadding: '0', border: '0' }),
            children: [
              this.createChildreElement({
                name: 'tr',
                children: [
                ]
              })
            ]
          })
        ]
      })
      let columnCount = 1
      while (columnNumber >= columnCount) {
        let column = this.createChildreElement({
          name: 'td',
          classes: ['content-box'],
          content: 'Even Column ' + columnCount,
          styles: this.stylesTagBuilder(),
          attributes: this.attributesObjectBuilder('td', { valign: 'top', width: (100 / columnNumber) + '%' })
        })
        element.children[0].children[0].children.push(column)
        columnCount++
      }
      this.addPreset(element)
    },
    addPresetStackColumns (columnNumber) {
      let msHacks = {
        nodes: [
          {
            text:
              `[if mso]>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="${this.emailWidth}">
              <tr>
              <td valign="top" width="${this.emailWidth / columnNumber}">
              <![endif]`,
            place: 'comment-1'
          }
        ]
      }
      if (columnNumber >= 2) {
        let count = 2
        while (count <= columnNumber) {
          msHacks.nodes.push({
            text:
              `[if mso]>
              </td>
              <td valign="top" width="${this.emailWidth / columnNumber}">
              <![endif]`,
            place: 'comment-' + count
          })
          count++
        }
      }
      msHacks.nodes.push({
        text:
          `[if mso]>
          </td>
          </tr>
          </table>
          <![endif]`,
        place: 'comment-' + (columnNumber + 1)
      })
      let element = this.createChildreElement({
        name: 'td',
        msHacks: msHacks,
        styles: { padding: '0' },
        attributes: this.attributesObjectBuilder('td', { align: 'center', valign: 'top' }),
        children: [
          this.createChildreElement({
            content: 'comment1',
            styles: { display: 'none' },
            classes: ['comment-1']
          })
        ]
      })
      let columnCount = 1
      while (columnNumber >= columnCount) {
        let column = this.createChildreElement({
          classes: ['stack-column'],
          styles: this.stylesTagBuilder({ display: 'inline-block', margin: '0 -1px', width: '100%', 'min-width': (this.emailWidth / columnNumber) + 'px', 'max-width': (this.emailWidth / columnNumber) + 'px', 'vertical-align': 'top' }),
          children: [
            this.createChildreElement({
              name: 'table',
              styles: this.stylesTagBuilder(),
              attributes: this.attributesObjectBuilder('table', { width: '100%', role: 'presentation', cellspacing: '0', cellpadding: '0', border: '0' }),
              children: [
                this.createChildreElement({
                  name: 'tr',
                  children: [
                    this.createChildreElement({
                      name: 'td',
                      content: '',
                      styles: this.stylesTagBuilder(),
                      attributes: this.attributesObjectBuilder('td'),
                      children: [
                        this.createChildreElement({
                          name: 'table',
                          styles: this.stylesTagBuilder({ 'text-align': 'center' }),
                          attributes: this.attributesObjectBuilder('table', { width: '100%', role: 'presentation', cellspacing: '0', cellpadding: '0', border: '0' }),
                          children: [
                            this.createChildreElement({
                              name: 'tr',
                              children: [
                                this.createChildreElement({
                                  name: 'td',
                                  classes: ['content-box'],
                                  styles: this.stylesTagBuilder(),
                                  attributes: this.attributesObjectBuilder('td'),
                                  content: 'Column ' + columnCount
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
        element.children.push(column)
        let comment = this.createChildreElement({
          content: 'comment' + (columnCount + 1),
          styles: { display: 'none' },
          classes: ['comment-' + (columnCount + 1)]
        })
        element.children.push(comment)
        columnCount++
      }
      this.addPreset(element)
    },
    deleteMasterRow () {
      this.emailing.design.mainRows[this.tableSelected].splice(this.rowSelected, 1)
      this.treeNodeSelected = null
    },
    deleteElement () {
      let index = parseInt(this.treeNodeSelected[this.treeNodeSelected.length - 1])
      let newSelectedElement = this.treeNodeSelected.substring(0, this.treeNodeSelected.length - 2)
      if (index > 0) newSelectedElement += '-' + (index - 1)
      this.selectedElementParent.children.splice(index, 1)
      this.treeNodeSelected = newSelectedElement
      // console.log(index)
      // let parent = this.selectParentNode(this.treeNodeSelected)
    },
    addPreset (presetRow) {
      this.selectedElement.children.push(presetRow)
      // this.emailing.design.mainRows[this.selectedRow].children.push(presetRow)
    },
    addElement (payload) {
      this.selectedElement.children.push(payload)
    }
  },
  created () {
  }
}
