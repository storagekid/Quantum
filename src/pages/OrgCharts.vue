<template>
  <q-page class="q-pa-md">
    <div class="row justify-center items-strech">
      <div class="col-xs-12 col-sm-2">
        <q-btn @click="addLevel">
          add level
        </q-btn>
        <div v-for="(level, index) in levels" :key="'Level'+index">
          <div class="row justify-center items-center">
            <q-btn icon="delete" @click="removeLevel(index)">Remove level</q-btn>
            <div class="q-mx-lg">{{level.name}}</div>
            <q-btn icon="add" @click="addLevelItem(index)">Add Item</q-btn>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-10">
        <div v-for="(level, index) in levels" :key="'Level'+index">
          <div class="row justify-center items-center level">
            <q-card v-for="(item, index) in level.items" :key="'Item'+index" class="chart-item">
              <q-card-section class="chart-item-name"></q-card-section>
              <q-card-section class="chart-item-job"></q-card-section>
            </q-card>
            <svg height="210" width="500">
              <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'OrgCharts',
  data () {
    return {
      canvasWidth: 0,
      levels: []
      // nameSize: 20,
      // namePaddingY: 15,
      // jobSize: 12,
      // jobPaddingY: 10,
      // itemsMargin: 10,
      // itemPaddingX: 20
    }
  },
  // watch: {
  //   items () {
  //     if (this.items.length) this.drawItems()
  //   }
  // },
  // computed: {
  //   items () {
  //     let items = []
  //     for (let level of this.levels) {
  //       if (level.items.length) {
  //         for (let item of level.items) {
  //           items.push(item)
  //         }
  //       }
  //     }
  //     return items
  //   }
  // },
  methods: {
    addLevel () {
      let level = {
        name: 'Level ' + (this.levels.length + 1),
        items: []
      }
      this.levels.push(level)
    },
    removeLevel (index) {
      this.levels.splice(index, 1)
    },
    addLevelItem (index) {
      this.levels[index].items.push({ name: 'name', job: 'job', width: 0, height: 0 })
      // this.drawItem()
    }
    // getCanvas () {
    //   let canvas = document.getElementById('chart')
    //   let ctx = canvas.getContext('2d')
    //   return ctx
    // },
    // drawItem () {
    //   let ctx = this.getCanvas()
    //   ctx.fillStyle = '#873173'
    //   ctx.fillRect(0, 0, 150, 75)
    // },
    // getCanvasSize () {
    //   let canvasWith = 0
    //   for (let level in this.levels) {
    //     let levelWidth = 0
    //     if (level.items.length) {
    //       levelWidth = this.getLevelWidth(level)
    //       if (levelWidth > canvasWith) canvasWith = levelWidth
    //     }
    //   }
    //   this.canvasWidth = canvasWith
    // },
    // getLevelWidth (level) {
    //   let width = 0
    //   for (let item of level.items) {
    //     width = width + item.width + (this.itemsMargin * 2)
    //   }
    //   return width
    // },
    // drawItems () {
    //   let canvas = document.getElementById('chart')
    //   let ctx = canvas.getContext('2d')
    //   let levelY = 0
    //   for (let level of this.levels) {
    //     if (level.items.length) {
    //       let levelWidth = 0
    //       for (let item of level.items) {
    //         levelWidth = levelWidth + item.width + (this.itemsMargin * 2)
    //       }
    //       if (levelWidth > this.canvasWidth) this.canvasWidth = levelWidth
    //       ctx.canvas.width = levelWidth
    //       let itemX = 0
    //       for (let item of level.items) {
    //         let fontSize = this.nameSize
    //         let paddingY = this.namePaddingY
    //         let paddingX = this.itemPaddingX
    //         ctx.font = this.nameSize + 'px Arial'
    //         ctx.fillStyle = '#873173'
    //         ctx.textAlign = 'center'
    //         var nameRectHeight = fontSize + paddingY
    //         var rectWidth = (item.name.length * fontSize) + paddingX
    //         var rectX = itemX
    //         var rectY = levelY
    //         ctx.fillRect(rectX, rectY, rectWidth, nameRectHeight)
    //         ctx.textAlign = 'center'
    //         ctx.textBaseline = 'middle'
    //         ctx.fillStyle = '#FFFFFF'
    //         ctx.fillText(item.name, rectX + (rectWidth / 2), rectY + (nameRectHeight / 2))
    //         let newRectY = nameRectHeight
    //         // Job Drawing
    //         fontSize = this.jobSize
    //         paddingY = 5
    //         ctx.font = this.jobSize + 'px Arial'
    //         ctx.fillStyle = '#FFFFFF'
    //         ctx.textAlign = 'center'
    //         let jobRectHeight = fontSize + paddingY
    //         // rectWidth = (item.name.length * fontSize) + paddingX
    //         rectY = newRectY
    //         ctx.fillRect(rectX, rectY, rectWidth, jobRectHeight)
    //         ctx.textAlign = 'center'
    //         ctx.textBaseline = 'middle'
    //         ctx.fillStyle = '#873173'
    //         ctx.fillText(item.job, rectX + (rectWidth / 2), rectY + (jobRectHeight / 2))
    //         itemX = itemX + rectWidth + this.itemsMargin
    //         // SET ITEM PROPERTIES
    //         item.width = rectWidth
    //         item.height = nameRectHeight + jobRectHeight
    //       }
    //     }
    //   }
    // }
  }
}
</script>

<style>
  .level {
    margin-bottom: 30px;
  }
  .chart-item {
    border: 2px solid #873173;
    margin: 0 10px;
    min-width: 100px;
  }
  .chart-item-name {
    background-color: #873173;
    color: white;
    padding: 2px 10px;
    min-height: 35px;
  }
  .chart-item-job {
    color: #873173;
    padding: 2px 10px;
    min-height: 20px;
  }
</style>
