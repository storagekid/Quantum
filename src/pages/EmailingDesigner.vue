<template>
  <q-page style="min-width: 1280px">
    <main-toolbar
      :emailings="emailings"
      :tableReady="tableReady"
      :tableSelected="tableSelected"
      :rowSelected="rowSelected"
      :selectedElement="selectedElement"
      :rowsLength="emailing.design.rows.length"
      :nodeHasStyles="nodeHasStyles"
      @showOpenSelector="showOpenSelector"
      @newEmail="newEmail"
      @saveEmail="saveEmail"
      @htmlFileBuilding="exportHTML"
      @deleteMasterRow="deleteMasterRow"
      @deleteElement="deleteElement"
      @addMainRow="addMainRow"
      @addPresetEvenColumns="addPresetEvenColumns"
      @addPresetStackColumns="addPresetStackColumns"
      @addCleanSpace="addCleanSpace"
      @addImageHero="addImageHero"
      @addElement="addElementHub"
      @arrangeItem="arrangeItem"
      @showNewFontWindow="newLinkedFont.state = true"
      @takeSnapshot="takeSnapshot"
      @sendQuickTest="sendQuickTest"
      @cleanSelectedStyles="cleanSelectedStyles"
      >
    </main-toolbar>
    <div class="row q-pa-sm">
      <div class="col q-pr-sm" style="height: calc(100vh - 100px); overflow: auto; max-width: 20%">
        <div class="q-gutter-xs">
          <edit-panel
            :emailing="emailing"
            :emailWidth="emailWidth"
            :rowSelected="rowSelected"
            :selectedElement="selectedElement"
            :treeNodeSelected="treeNodeSelected"
            @addPreset="addPreset"
            @addElement="addElement"
            @treeNodeSelected="selectTreeNode"
            @contentNodeSelected="selectContentNode"
            >
          </edit-panel>
        </div>
      </div>
      <div class="col text-center" :style="{ 'max-height': 'calc(100vh - 100px)', 'overflow': 'auto', 'padding-bottom': '20px', 'background-color': emailing.design['body-background-color'], 'text-align': 'center' }">
        <designer
          :design="emailing.design"
          :emailWidth="emailWidth"
          :rowSelected="rowSelected"
          :selectedElement="selectedElement"
          :treeNodeSelected="treeNodeSelected"
          @rowSelected="selectRow"
          @elementSelected="selectElement"
          @clearSelectedElement="clearSelectedElement"
          @clearSelections="clearSelections"
          v-if="designerOpened"
          >
        </designer>
      </div>
      <div class="col q-pl-sm" style="max-height: calc(100vh - 100px); overflow: auto; max-width: 20%; min-width: 300px">
        <style-sidebar
          :emailing="emailing"
          :emailWidth="emailWidth"
          :rowSelected="rowSelected"
          :selectedElement="selectedElement"
          :contentNodeSelected="contentNodeSelected"
          :userFonts="emailing.design.fonts"
          v-if="ready"
          >
        </style-sidebar>
      </div>
      <!-- New Email Pop Up BEGIN (OBSOLET) -->
      <q-dialog v-model="newEmailing.state" persistent v-if="modelsReady">
        <q-card style="min-width: 600px">
          <q-card-section class="bg-primary text-white text-center">
            New Emailing
          </q-card-section>
          <q-card-section>
            <model-form
              mode="new"
              :modelName="modelName"
              v-on:dirtiness="checkDirtyness"
              v-on:fieldChanged="updateAndCheck"
              :model="newEmailing.data"
              :quasarData="$store.state.Model.models.emailings.quasarData"
              :step="$store.state.Model.models.emailings.quasarData.newLayout[0]"
              >
            </model-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn label="Crear" color="positive" v-close-popup @click="startNewEmailing" :disable="newEmailing.errors"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- New Email Pop Up END -->

      <!-- Email Loader Pop Up BEGIN -->
      <q-dialog v-model="openEmailingWindow.state" persistent>
        <q-card style="min-width: 1000px">
          <q-card-section class="bg-primary text-white text-center text-h6">
            Email loader
          </q-card-section>
          <q-card-section>
            <q-table
              grid
              title="Emailings"
              :selected.sync="openEmailingWindow.selected"
              selection="single"
              :data="emailings"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-header
              :rows-per-page-options='[8, 12, 16]'
            >
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn label="Load" color="positive" @click="parseEmailAndClose" :disable="!openEmailingWindow.selected.length"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Email Loader Pop Up END -->

      <!-- New Font Pop Up BEGIN -->
      <q-dialog v-model="newLinkedFont.state" persistent>
        <q-card style="min-width: 600px">
          <q-card-section class="bg-primary text-white text-center text-h6">
            New Font (Link)
          </q-card-section>
          <q-card-section v-if="newLinkedFont.fetched === false">
            <q-input square filled v-model="newLinkedFont.link" label="Square filled" />
          </q-card-section>
          <q-card-section class="q-gutter-sm" v-else>
            <div class="text-primary text-h6 text-center">Set font names to use</div>
            <template v-for="(fontName, index) in emailing.design.fonts[newLinkedFont.fetched].names">
              <q-input square filled v-model="emailing.design.fonts[newLinkedFont.fetched].names[index].label" label="Font Name" :key="index"/>
            </template>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn label="Load" color="positive" @click="loadLinkFont" v-if="newLinkedFont.fetched === false"/>
            <q-btn label="Add" color="positive" @click="setUserFont" v-else/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- New Font Pop Up END -->

      <!-- Snapshot Pop Up BEGIN -->
      <q-dialog v-model="mailToImage.state" persistent>
        <q-card :style="{'min-width': (emailWidth + 60) + 'px'}" class="text-center">
          <q-card-section class="bg-primary text-white text-center text-h6">
            Email to image
          </q-card-section>
          <q-card-section>
            <q-img :src="mailToImage.image"></q-img>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Snapshot Pop Up END -->
    </div>
  </q-page>
</template>

<script>
import domtoimage from 'dom-to-image'
import ModelForm from '../components/model/modelForm'
import MainToolbar from '../components/emailingDesigner/mainToolbar'
// import ToolbarMenu from '../components/emailingDesigner/ToolbarMenu'
import EditPanel from '../components/emailingDesigner/EditPanel'
import StyleSidebar from '../components/emailingDesigner/StyleSidebar'
import Designer from '../components/emailingDesigner/Designer'
import { customSelectMixins } from '../mixins/customSelectMixins'
import { ModelsFetcher, ModelBuilder, ModelUpdaterBuilder, ModelController, ModelRelations, RelationController } from '../mixins/modelMixin'
import { EmailDesignerMixin } from '../mixins/emailDesignerMixin'
import { CreateAndDeleteMixin } from '../mixins/createAndDeleteMixin'

export default {
  name: 'emailing-designer',
  mixins: [ ModelsFetcher, customSelectMixins, ModelBuilder, ModelUpdaterBuilder, ModelController, ModelRelations, RelationController, EmailDesignerMixin, CreateAndDeleteMixin ],
  components: { ModelForm, Designer, MainToolbar, EditPanel, StyleSidebar },
  data () {
    return {
      ready: false,
      saving: false,
      modelName: 'emailings',
      modelsNeeded: {
        emailings: {
          full: true
        }
      },
      columns: [],
      visibleColumns: [],
      names: [],
      options: {},
      filter: '',
      filters: {
        'searchBar': { text: '' }
      },
      fetchingTable: false,
      tableReady: false,
      emailingSelected: null,
      newEmailing: {
        state: false,
        errors: false,
        data: {
          name: null,
          description: null,
          campaign_id: null,
          company_id: null
        }
      },
      openEmailingWindow: {
        state: false,
        selected: []
      },
      newLinkedFont: {
        state: false,
        link: 'https://www.bankia.es/estaticos/Portal-unico/css/fonts.css',
        fetched: false
      },
      mailToImage: {
        state: false,
        image: ''
      },
      emailing: {},
      designerOpened: false,
      selectedRow: null,
      selectedElement: null,
      selectedElementParent: null,
      treeNodeSelected: null,
      contentNodeSelected: null,
      userPresets: {
        styles: [
          {
            label: 'Bankia Bold',
            value: JSON.stringify({ 'font-family': "'BankiaBold','Source Sans Pro',Tahoma,Verdana,Segoe,sans-serif", 'font-weight': 600 })
          }
        ]
      }
    }
  },
  computed: {
    tableSelected () {
      if (this.treeNodeSelected) return this.treeNodeSelected[0]
      return 0
    },
    rowSelected () {
      if (this.treeNodeSelected && this.treeNodeSelected.length > 2) return this.treeNodeSelected[2]
      return null
    },
    nodeHasStyles () {
      if (!this.selectedElement) return false
      if (!this.selectedElement.styles) return false
      if (!Object.keys(this.selectedElement.styles).length) return false
      return true
    },
    quasarData () {
      if (!this.modelsReady) return {}
      return this.$store.state.Model.models[this.modelName].quasarData
    },
    emailings () {
      return this.$store.state.Model.models.emailings.items
    },
    emailWidth () {
      return parseInt(this.emailing.design.styles.width.substring(0, this.emailing.design.styles.width.indexOf('p')))
    },
    rowCount () {
      return Object.keys(this.emailing.design.mainRows).length
    }
    // elementContentParsed () {
    //   let contentParsed = []
    //   if (!this.selectedElement) return contentParsed
    //   else {
    //     // return 'patata'
    //     // console.log('Lets Try')
    //     let pos = 0
    //     let round = 0
    //     // console.log('Content length: ' + this.selectedElement.content.length)
    //     while (pos < this.selectedElement.content.length && round < 200) {
    //       let tag = {
    //         type: null,
    //         styles: {},
    //         attribuyes: [],
    //         text: ''
    //       }
    //       // console.log('Lets Try Again')
    //       // console.log(pos)
    //       // console.log('Round ' + round)
    //       // console.log(this.selectedElement.content.substring(pos, pos + 3))
    //       if (this.selectedElement.content[pos] === '<') {
    //         // console.log('Start Tag')
    //         let substring = this.selectedElement.content.substring(pos, (this.selectedElement.content.indexOf('>', pos) + 1))
    //         // console.log(substring)
    //         let type = substring[1] === '/' ? 'closeTag' : 'openTag'
    //         let text = substring
    //         if (type === 'openTag') if (substring.indexOf(' ') > -1) text = substring.substring(0, substring.indexOf(' ')) + '>'
    //         tag.type = type
    //         tag.styles = type === 'openTag' ? this.buildStylesFromString(substring) : {}
    //         tag.styles = type === 'openTag' ? this.buildAttributesFromString(substring) : {}
    //         tag.text = text
    //         contentParsed.push(tag)
    //         pos = pos + substring.length
    //       } else {
    //         // console.log('Start TEXT')
    //         let substring = this.selectedElement.content.substring(pos, (this.selectedElement.content.indexOf('<', pos - 1)))
    //         tag.type = 'text'
    //         tag.text = substring
    //         contentParsed.push(tag)
    //         pos = pos + substring.length
    //       }
    //       // console.log(pos)
    //       round++
    //       // break
    //     }
    //     return contentParsed
    //   }
    // }
  },
  methods: {
    sendQuickTest () {
      let html = this.htmlFileBuilding(this.emailing, { comments: true, width: this.emailWidth })
      this.$axios({
        url: this.$store.state.App.dataWarehouse + 'emailings/sendtest',
        method: 'POST',
        data: {
          html: html
        }
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    exportHTML () {
      console.log('Exporting')
      let html = this.htmlFileBuilding(this.emailing, { comments: true, width: this.emailWidth })
      this.textFileDownload(html, this.emailing.name)
    },
    buildAttributesFromString (string) {
      // console.log('Building Attributes from String')
      string = '<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="width: 600px; background-color: rgb(255, 255, 255); margin: auto; padding: 0px !important;">'
      // string = '<table align="center">'
      let cleanString = (string.substring(string.indexOf(' '), string.length - 1)).trim()
      // console.log(cleanString)
      let attributesArray = cleanString.split('" ')
      // console.log(attributesArray)
      let attributesObject = {}
      for (let attribute of attributesArray) {
        let tempArray = attribute.split('=')
        if (tempArray.length < 2 || tempArray[0] === 'style' || tempArray[0] === 'class') continue
        attributesObject[tempArray[0].trim().replace(/"/gi, '')] = tempArray[1].trim().replace(/"/gi, '')
      }
      // console.log('attributes: ')
      // console.log(attributesObject)
      return attributesObject
    },
    buildStylesFromString (string) {
      // console.log('Building Styles from String')
      string = '<span style="color: red">'
      // console.log(string)
      if (string.indexOf('style="') === -1) return {}
      let start = string.indexOf('style="') + 'style="'.length
      let styles = string.substring(start, string.indexOf('"', start + 'style="'.length + 2))
      // console.log(styles)
      let stylesArray = styles.indexOf(';' > -1) ? styles.split(';') : [styles]
      let stylesObject = {}
      for (let style of stylesArray) {
        let tempArray = style.split(':')
        if (tempArray.length < 2) continue
        stylesObject[tempArray[0].trim()] = tempArray[1].trim()
        // console.log(tempArray)
      }
      // console.log('styles: ')
      // console.log(stylesObject)
      return stylesObject
    },
    takeSnapshot () {
      let bodyContainer = document.getElementById('email-body')
      let images = bodyContainer.getElementsByTagName('img')
      let vm = this
      let oldLinks = {}
      let fetched = 0
      for (let image of images) {
        this.$set(oldLinks, image.id, image.src)
        fetch('https://cors-anywhere.herokuapp.com/' + image.src).then(response => response.blob()).then(response => {
          // console.log('Inside Fetcher')
          // console.log(images.length)
          var reader = new FileReader()
          reader.readAsDataURL(response)
          reader.onloadend = function () {
            // console.log('Inside onloadend')
            // console.log(images.length)
            var base64data = reader.result
            image.src = base64data
            fetched++
            if (fetched === images.length) {
              domtoimage.toPng(bodyContainer).then((imageData) => {
                // console.log('Inside DomToImage')
                // console.log(oldLinks)
                vm.mailToImage.image = imageData
                vm.mailToImage.state = true
                // console.log('Image Created')
                vm.restoreImageLinks(images, oldLinks)
              }).catch(() => {
                // console.log(error)
                vm.restoreImageLinks(images, oldLinks)
              })
            }
          }
        })
      }
    },
    restoreImageLinks (images, oldLinks) {
      let round = 0
      while (round < images.length) {
        images[round].src = oldLinks[images[round].id]
        round++
      }
    },
    cleanSelectedStyles (payload) {
      if (!payload) this.selectedElement.styles = this.stylesCleaner(this.selectedElement.styles)
      else {
        for (let row of this.emailing.design.mainRows) {
          if (row.styles) row.styles = this.stylesCleaner(row.styles)
          if (row.children.length) this.cleanChildrenStyles(row.children)
        }
      }
    },
    cleanChildrenStyles (children) {
      for (let child of children) {
        if (child.styles) child.styles = this.stylesCleaner(child.styles)
        if (child.children.length) this.cleanChildrenStyles(child.children)
      }
    },
    newEmail () {
      const data = {
        name: 'Test Emailing',
        description: 'Test Emiling for designer'
      }
      this.initializeEmailing(data)
      this.clearSelections()
    },
    parseEmailAndClose () {
      for (let key in this.emailing) this.emailing[key] = this.openEmailingWindow.selected[0][key]
      this.emailing.design = JSON.parse(this.emailing.design)
      let baseDesign = this.setDesign()
      for (let prop in baseDesign) if (!this.emailing.design[prop]) this.$set(this.emailing.design, prop, baseDesign[prop])
      if (this.emailing.design.fonts.length) {
        for (let emailFont of this.emailing.design.fonts) this.loadFontCSS(emailFont.css)
      }
      let options = this.setEmailingOptions()
      console.log(options)
      if (!this.emailing.design.options) this.$set(this.emailing.design, 'options', {})
      for (let option in options) if (!this.emailing.design.options[option]) this.$set(this.emailing.design.options, option, options[option])
      this.openEmailingWindow.selected = []
      this.openEmailingWindow.state = false
    },
    getTable () {
      if (this.fetchingTable) return
      this.fetchingTable = true
      let params = {
        model: this.modelName,
        tableView: this.tableView
      }
      this.$axios({
        url: this.$store.state.App.dataWarehouse + 'table',
        method: 'GET',
        params: params
      }).then(({ data }) => {
        this.columns = data.table.columns
        this.options = data.table.options
      }).then(() => {
        for (let column of this.columns) {
          if (column.show) this.visibleColumns.push(column.field)
          this.$set(column, '__filterClass', 'q-table__sort-icon q-table__filter-icon q-table__sort-icon--left')
          this.$set(this.filters, column.name, {})
          this.$set(this.filters[column.name], 'text', '')
          this.$set(this.filters[column.name], 'options', 'has')
          this.$set(this.filters[column.name], 'label', column.label)
          this.names.push('body-cell-' + column.name)
        }
        this.columns.map(i => {
          if (i.name.indexOf('.') > -1) {
            let names = i.name.split('.')
            i['field'] = function (row) {
              let item = row[names[0]]
              for (let i = 1; i < names.length; i++) {
                if (!item) {
                  continue
                }
                item = item[names[i]]
              }
              return item
            }
          }
          return i
        })
        this.fetchingTable = false
        this.tableReady = true
      }).catch((e) => {
        return e
      })
    },
    showOpenSelector () {
      this.openEmailingWindow.state = true
    },
    updateEmail () {
      this.$emit('formSent')
      let model = JSON.parse(JSON.stringify(this.emailing))
      model.design = JSON.stringify(model.design)
      let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(model) }
      this.saveModel(payload, 'update').then(() => { this.$emit('formResponded') }).catch(() => { this.$emit('formRespondedWithErrors') })
    },
    saveEmail () {
      if (this.saving) return false
      this.saving = true
      if (this.emailing.id) return this.updateEmail()
      this.$emit('formSent')
      let data = {}
      for (let key in this.emailing) this.$set(data, key, this.emailing[key])
      data.design = JSON.stringify(data.design)
      data.user_id = 1
      data.name = 'Emailing Test: ' + Date.now()
      let payload = { name: this.modelName, model: this.fieldsObjectValueExtrator(data) }
      this.saveModel(payload, 'new').then((response) => {
        this.$set(this.emailing, 'id', response.model.id)
        this.$emit('formRespondedOK')
      }).catch(() => {
        this.saving = false
        this.$emit('formRespondedWithErrors')
      })
    },
    loadLinkFont () {
      let userFont = {
        link: this.newLinkedFont.link,
        names: [],
        css: ''
      }
      fetch('https://cors-anywhere.herokuapp.com/' + this.newLinkedFont.link).then(response => response.text()).then(response => {
        var str = response
        userFont.css = response
        // console.log(response)
        var regex = /font-family:/gi, result, indices = []
        while ((result = regex.exec(str))) {
          indices.push(result.index)
        }
        let wordLength = ('font-family'.length) - 1
        for (let index of indices) {
          let start = str.indexOf('"', index + wordLength)
          let fontFamilyName = str.substring((start + 1), str.indexOf('"', (start + 1)))
          // console.log(fontFamilyName)
          userFont.names.push({
            label: fontFamilyName,
            value: fontFamilyName
          })
        }
        this.emailing.design.fonts.push(userFont)
        this.newLinkedFont.fetched = (this.emailing.design.fonts.length - 1)
      })
      // console.log(matches)
    },
    setUserFont () {
      this.loadFontCSS(this.emailing.design.fonts[this.newLinkedFont.fetched].css)
      this.clearNewLinkedFont()
    },
    loadFontCSS (css) {
      var newFont = document.createElement('style')
      newFont.appendChild(document.createTextNode(css))
      document.head.appendChild(newFont)
    },
    clearNewLinkedFont () {
      this.newLinkedFont.link = ''
      this.newLinkedFont.state = false
      this.newLinkedFont.fetched = false
    },
    loadFonts (fontLink) {
      // fontLink = 'https://www.bankia.es/estaticos/Portal-unico/css/fonts.css'
      // <link href="https://www.bankia.es/estaticos/Portal-unico/css/fonts.css" rel="stylesheet">
      let link = document.createElement('link')
      link.href = fontLink
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      // console.log(link)
    },
    arrangeItem (direction) {
      let rowToMove = this.emailing.design.mainRows.splice(this.selectedRow, 1)[0]
      let position = null
      if (direction === 'up') position = this.selectedRow - 1
      else if (direction === 'down') position = this.selectedRow + 1
      else if (direction === 'first') position = 0
      else if (direction === 'last') position = (this.emailing.design.mainRows.length)
      this.emailing.design.mainRows.splice(position, 0, rowToMove)
      this.selectedRow = position
    },
    initializeEmailing (data) {
      // console.log(data)
      this.$set(this.emailing, 'id', data ? data.id : null)
      this.$set(this.emailing, 'name', data ? data.name : null)
      this.$set(this.emailing, 'description', data ? data.description : null)
      this.$set(this.emailing, 'company_id', data ? data.company_id : null)
      this.$set(this.emailing, 'campaign_id', data ? data.campaign_id : null)
      this.$set(this.emailing, 'design', data ? data.design : null)
      this.$set(this.emailing, 'user_id', data ? data.user_id : null)
      this.$set(this.emailing, 'emailing_file_id', data ? data.emailing_file_id : null)
      this.$set(this.emailing, 'mirror_file_id', data ? data.mirror_file_id : null)
      this.$set(this.emailing, 'design', this.setDesign())
    },
    setDesign () {
      const design = {
        styles: {
          width: '600px',
          'background-color': '#FFFFFF',
          'font-family': 'sans-serif, Verdana',
          'font-weight': '',
          'font-size': '',
          margin: 'auto',
          padding: '0 !important'
        },
        options: this.setEmailingOptions(),
        'body-background-color': '#518578',
        mainRows: [
          this.createChildreElement({
            name: 'table',
            attributes: { 'align': 'center', 'role': 'presentation', 'cellspacing': '0', 'cellpadding': '0', 'border': '0', 'width': 600 },
            styles: {
              width: '600px',
              'background-color': '#FFFFFF',
              'font-family': 'sans-serif, Verdana',
              'font-weight': '',
              'font-size': '',
              margin: 'auto',
              padding: '0 !important'
            },
            classes: [ 'email-container', 'main-table' ]
          })
        ],
        rows: [],
        classes: [],
        fonts: []
      }
      return design
    },
    setEmailingOptions () {
      return {
        title: '',
        preheaderText: '',
        cascadeStyles: {
          'background-color': true,
          'font-family': true
        },
        hacks: {
          mso: true,
          preheader: true,
          spaceHack: true,
          hasMirror: true,
          comments: false
        }
      }
    },
    startNewEmailing () {
      this.initializeEmailing(this.newEmailing.data)
      this.resetNewEmailing()
      this.clearSelections()
      this.startDesigner()
    },
    resetNewEmailing () {
      this.newEmailing.data = {
        name: null,
        description: null,
        campaign_id: null,
        company_id: null
      }
    },
    startDesigner () {
      this.designerOpened = true
    },
    selectRow (payload) {
      // console.log('Row Selected: ' + payload)
      this.selectedRow = payload
      this.treeNodeSelected = payload.toString()
      this.selectedElement = this.emailing.design.mainRows[payload]
    },
    selectElement (payload) {
      // console.log('Element Selected: ' + payload)
      // this.selectTreeNode(payload)
      this.treeNodeSelected = payload
    },
    clearSelections () {
      this.selectedElement = null
      this.selectedRow = null
      this.treeNodeSelected = null
    },
    clearSelectedElement () {
      this.selectedElement = null
    },
    selectContentNode (payload) {
      this.contentNodeSelected = payload
    },
    selectTreeNode (payload) {
      console.log('Select Tree Node')
      console.log(payload)
      this.treeNodeSelected = payload
      if (payload !== null) {
        this.selectedRow = parseInt(payload[0])
        if (!payload) return
        let rowElement = payload.split('-')
        // console.log(rowElement)
        let selectedElement = this.emailing.design.mainRows[rowElement[0]]
        let levelCounter = 1
        let parentSet = false
        if (rowElement.length === 2) {
          this.selectedElementParent = selectedElement
          parentSet = true
        }
        while (levelCounter < rowElement.length) {
          // console.log('Level: ' + levelCounter)
          selectedElement = selectedElement.children[rowElement[levelCounter]]
          if (!parentSet) if (levelCounter === rowElement.length - 2) this.selectedElementParent = selectedElement
          levelCounter++
        }
        this.selectedElement = selectedElement
      } else {
        this.selectedElement = null
        this.selectedRow = null
      }
    },
    selectParenNode (payload) {
      // console.log('Select Tree Node')
      // console.log(payload)
      let parent = null
      if (payload !== null) {
        let rowElement = payload.split('-')
        // console.log(rowElement)
        let selectedElement = this.emailing.design.mainRows[rowElement[0]]
        let levelCounter = 1
        while (levelCounter < rowElement.length - 1) {
          // console.log('Level: ' + levelCounter)
          selectedElement = selectedElement.children[rowElement[levelCounter]]
          levelCounter++
        }
        parent = selectedElement
      }
      return parent
    },
    checkDirtyness (payload) {
      this.newEmailing.errors = payload.dirty
    },
    updateAndCheck (payload) {
      this.model[payload.field] = payload.value
    },
    startTest () {
      return new Promise((resolve, reject) => {
        const data = {
          name: 'Test Emailing',
          description: 'Test Emiling for designer'
        }
        this.initializeEmailing(data)
        this.startDesigner()
        resolve()
      })
    }
  },
  created () {
    this.getTable()
    this.startTest().then(() => { this.ready = true })
    this.buildAttributesFromString('')
    // this.loadFonts()
  }
}
</script>
<style lang="stylus">
  #e-designer-toolbar {
    button {
      font-size .5em
    }
    div > div {
      font-size .8em
    }
  }
  .q-list--dark {
    background-color $accent
    font-size .9em
  }
</style>
