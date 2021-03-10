<template>
  <div class="row">
    <q-bar id="e-designer-toolbar" class="full-width bg-accent text-primary text-white text-weight-bold">
      <div class="row q-gutter-lg">
        <toolbar-menu menuName="File">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px;">
              <q-item clickable v-close-popup @click="showOpenSelector" :disable="!emailings.length || !tableReady">
                <q-item-section>Open...</q-item-section>
                <toolbar-menu-shorcut :icons="['upgrade']" keys='O'></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable v-close-popup @click="newEmail">
                <q-item-section>New</q-item-section>
                <toolbar-menu-shorcut :icons="['upgrade']" keys='N'></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable v-close-popup @click="saveEmail">
                <q-item-section>Save</q-item-section>
                <toolbar-menu-shorcut :icons="['upgrade']" keys='S'></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable v-close-popup @click="htmlFileBuilding">
                <q-item-section>Export HTML</q-item-section>
                <toolbar-menu-shorcut :icons="['upgrade']" keys='E'></toolbar-menu-shorcut>
              </q-item>

              <q-separator />

              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left">
                  <q-list>
                    <q-item
                      v-for="n in 3"
                      :key="n"
                      dense
                      clickable
                    >
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top right" self="top left">
                        <q-list>
                          <q-item
                            v-for="n in 3"
                            :key="n"
                            dense
                            clickable
                          >
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>

        <toolbar-menu menuName="Edit">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px">
              <q-item clickable @click="deleteMasterRow" :disable="deleteMasterRowDisable">
                <q-item-section>Delete Main Row</q-item-section>
              </q-item>
              <q-item clickable @click="deleteElement" :disable="deleteElementDisable">
                <q-item-section>Delete Element</q-item-section>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>

        <toolbar-menu menuName="Create">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px">
              <q-item clickable @click="addMainRow" :disable="addMainRowDisabled">
                <q-item-section>Master Row</q-item-section>
                <toolbar-menu-shorcut :icons="['upgrade']" keys='R'></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable :disable="addPresetRowDisabled">
                <q-item-section>Preset (Rows)</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left">
                  <q-list dense>
                    <q-item
                      v-for="n in 4"
                      :key="'EC-' + n"
                      dense
                      clickable
                      @click="addPresetEvenColumns(n)"
                    >
                      <q-item-section>{{ n }} Columns (Fluid)</q-item-section>
                    </q-item>
                    <q-item
                      v-for="n in 4"
                      :key="'SC-' + n"
                      dense
                      clickable
                      @click="addPresetStackColumns(n)"
                    >
                      <q-item-section>{{ n }} Columns (Stack)</q-item-section>
                    </q-item>
                    <q-item clickable @click="addCleanSpace">
                      <q-item-section>Clean Space (40px)</q-item-section>
                    </q-item>
                    <q-item clickable @click="addImageHero">
                      <q-item-section>Image Hero</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable :disable="elementAddingDisabled">
                <q-item-section>Elements</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top right" self="top left" v-if="!elementAddingDisabled">
                  <q-list dense>
                    <q-item clickable @click="addElement('column')" :disable="elementColumnDisabled">
                      <q-item-section>Column</q-item-section>
                    </q-item>
                    <q-item clickable @click="addElement('button')" :disable="elementButtonDisabled">
                      <q-item-section>Button</q-item-section>
                    </q-item>
                    <q-item clickable @click="addElement('text')">
                      <q-item-section>Text</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>

        <toolbar-menu menuName="Arrange">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px">
              <q-item clickable @click="arrangeItem('up')" :disable="arrangeDisable.up">
                <q-item-section>Up</q-item-section>
                <toolbar-menu-shorcut :icons="['north']"></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable @click="arrangeItem('down')" :disable="arrangeDisable.down">
                <q-item-section>Down</q-item-section>
                <toolbar-menu-shorcut :icons="['south']"></toolbar-menu-shorcut>
              </q-item>
              <q-item clickable @click="arrangeItem('first')" :disable="arrangeDisable.up">
                <q-item-section>First</q-item-section>
                <toolbar-menu-shorcut :icons="['west']"></toolbar-menu-shorcut>
              </q-item>
              <q-separator />
              <q-item clickable @click="arrangeItem('last')" :disable="arrangeDisable.down">
                <q-item-section>Last</q-item-section>
                <toolbar-menu-shorcut :icons="['east']"></toolbar-menu-shorcut>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>

        <toolbar-menu menuName="Fonts">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px">
              <q-item clickable @click="showNewFontWindow">
                <q-item-section>Load Font (Link)</q-item-section>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>

        <toolbar-menu menuName="Utils">
          <template v-slot:menu-content>
            <q-list dark dense style="min-width: 100px">
              <q-item clickable @click="takeSnapshot" :disable="!rowsLength">
                <q-item-section>Take Snapshot</q-item-section>
              </q-item>
              <q-item clickable @click="sendQuickTest" :disable="!rowsLength">
                <q-item-section>Quick Test</q-item-section>
              </q-item>
              <q-item clickable @click="cleanSelectedStyles()" :disable="!nodeHasStyles">
                <q-item-section>Clean Styles (Selected Element)</q-item-section>
              </q-item>
              <q-item clickable @click="cleanSelectedStyles('*')" :disable="!rowsLength">
                <q-item-section>Clean Styles (All Elements)</q-item-section>
              </q-item>
            </q-list>
          </template>
        </toolbar-menu>
      </div>

      <q-space />

      <q-btn dense flat icon="crop_square" />
    </q-bar>
  </div>
</template>

<script>
import ToolbarMenu from './ToolbarMenu'
import ToolbarMenuShorcut from './toolbarMenuShorcut'

export default {
  name: 'MainToolbar',
  props: ['emailings', 'tableReady', 'tableSelected', 'rowSelected', 'rowsLength', 'nodeHasStyles', 'selectedElement'],
  components: { ToolbarMenu, ToolbarMenuShorcut },
  data () {
    return {
      keyDown: false,
      patata: [],
      keyIsPress: false
    }
  },
  computed: {
    addMainRowDisabled () {
      if (this.tableSelected === null) return true
      return false
    },
    addPresetRowDisabled () {
      if (this.rowSelected === null) return true
      if (this.selectedElement) {
        if (this.selectedElement.children) if (this.selectedElement.children.length || this.selectedElement.name !== 'tr') return true
      }
      return false
    },
    elementAddingDisabled () {
      if (!this.selectedElement) return true
      if (this.selectedElement.classes.includes('unmodifiable')) return true
      // else if (this.selectedElement.classes.includes('content-box')) return false
      return false
    },
    elementColumnDisabled () {
      if (this.elementAddingDisabled) return true
      if (this.selectedElement.name === 'tr') {
        if (this.selectedElement.children.length > 3) return true
        return false
      }
      return true
    },
    elementButtonDisabled () {
      if (this.elementAddingDisabled) return true
      if (this.selectedElement.name === 'td') {
        if (this.selectedElement.children.length) return true
        return false
      }
      return true
    },
    deleteMasterRowDisable () {
      return this.rowSelected === null
    },
    deleteElementDisable () {
      if (!this.selectedElement) return true
      if (this.selectedElement.name === 'tr') return true
      return false
    },
    arrangeDisable () {
      return {
        up: this.rowSelected === 0 || !this.rowSelected,
        down: (this.rowSelected === (this.rowsLength - 1)) || this.rowSelected === null
      }
    }
  },
  methods: {
    showOpenSelector () {
      this.$emit('showOpenSelector')
    },
    newEmail () {
      this.$emit('newEmail')
    },
    saveEmail () {
      this.$emit('saveEmail')
    },
    htmlFileBuilding () {
      this.$emit('htmlFileBuilding')
    },
    deleteMasterRow () {
      this.$emit('deleteMasterRow')
    },
    deleteElement () {
      this.$emit('deleteElement')
    },
    addMainRow () {
      this.$emit('addMainRow')
    },
    addPresetEvenColumns (n) {
      this.$emit('addPresetEvenColumns', n)
    },
    addPresetStackColumns (n) {
      this.$emit('addPresetStackColumns', n)
    },
    addCleanSpace () {
      this.$emit('addCleanSpace')
    },
    addImageHero () {
      this.$emit('addImageHero')
    },
    addElement (name) {
      this.$emit('addElement', name)
    },
    arrangeItem (dir) {
      this.$emit('arrangeItem', dir)
    },
    showNewFontWindow () {
      this.$emit('showNewFontWindow')
    },
    takeSnapshot () {
      this.$emit('takeSnapshot')
    },
    sendQuickTest () {
      this.$emit('sendQuickTest')
    },
    cleanSelectedStyles (nodes) {
      this.$emit('cleanSelectedStyles', nodes)
    },
    keyDownCleaner (e) {
      this.keyDown = false
    },
    keyPressHandler (e) {
      if (this.keyIsPress) return
      this.keyIsPress = true
      setTimeout(() => {
        this.keyIsPress = false
      }, 3000)
      console.log('Preeeeesing')
      // console.log(e)
      // console.log(e.keyCode)
      // console.log(String.fromCharCode(e.keyCode).toLowerCase())
      switch (e.keyCode) {
        case 79:
          this.showOpenSelector()
          break
        case 78:
          this.newEmail()
          break
        case 83:
          this.saveEmail()
          break
        case 69:
          this.htmlFileBuilding()
          break
        case 82:
          this.addMainRow()
          break
      }
    },
    keyDownHandler (e) {
      // console.log(e)
      // console.log(e.keyCode)
      // console.log(String.fromCharCode(e.keyCode).toLowerCase())
      switch (e.keyCode) {
        case 37:
          if (!this.arrangeDisable.up) this.arrangeItem('first')
          break
        case 38:
          if (!this.arrangeDisable.up) this.arrangeItem('up')
          break
        case 39:
          if (!this.arrangeDisable.down) this.arrangeItem('last')
          break
        case 40:
          if (!this.arrangeDisable.down) this.arrangeItem('down')
          break
      }
    }
  },
  mounted () {
    window.addEventListener('keypress', this.keyPressHandler)
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyDownCleaner)
  },
  beforeDestroy () {
    window.removeEventListener('keypress', this.shortCutHandler)
    window.removeEventListener('keydown', this.keyDownHandler)
  }
}
</script>
