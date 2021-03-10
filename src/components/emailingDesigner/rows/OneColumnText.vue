<template>
    <td width="600">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td :style="tdStyles" v-html="data.styles['text-body']">
                </td>
            </tr>
        </table>
    </td>
</template>

<script>
export default {
  name: 'one-column-text',
  props: [ 'data' ],
  data () {
    return {}
  },
  computed: {
    // src () {
    //   return this.data['image-source'] === 'local' ? this.data['local-url'] : this.data['remote-url']
    // },
    tdStyles () {
      return {
        width: '100%',
        padding: this.data.styles.padding,
        'text-align': this.data.styles['text-align'],
        'vertical-align': this.data.styles['vertical-align'],
        'font-family': this.data.styles['font-family'],
        'font-size': this.data.styles['font-size'],
        'line-height': this.data.styles['line-height'],
        color: this.data.styles['color'],
        'background-color': this.data.styles['background-color']
      }
    }
  }
}
</script>
