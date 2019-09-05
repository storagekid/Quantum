<template>
  <q-btn-group style="display: flex" class="bg-white q-mt-md" :class="classes" :style="styles">
    <q-btn
      v-for="(country, index) in options"
      :key="index"
      @click="changeLanguage(country.value)"
      size="xs"
      :style="btnStyles"
      :class="btnClasses"
    >
    <img :src="country.image" :alt="country.label" width="" :style="{width:'100%', opacity: country.value === $i18n.locale ? 1 : 0.3}">
    </q-btn>
  </q-btn-group>
</template>

<script>
import GB from 'svg-country-flags/png250px/gb.png'
import ES from 'svg-country-flags/png250px/es.png'
import IT from 'svg-country-flags/png250px/it.png'
import FR from 'svg-country-flags/png250px/fr.png'
import DE from 'svg-country-flags/png250px/de.png'

export default {
  props: ['classes', 'styles', 'btn-styles', 'btn-classes'],
  data () {
    return {
      lang: this.$q.lang.isoName,
      options: [
        { label: 'Spanish', value: 'es', image: ES, className: 'flag-selector' },
        { label: 'English (UK)', value: 'en-gb', image: GB, className: 'flag-selector' },
        { label: 'Italian', value: 'it', image: IT, className: 'flag-selector' },
        { label: 'French', value: 'fr', image: FR, className: 'flag-selector' },
        { label: 'German', value: 'de', image: DE, className: 'flag-selector' }
      ]
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.commit('App/setSetting', { name: 'lang', value: lang })
      import(`quasar/lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    }
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      this.$i18n.locale = lang
      this.$store.commit('App/setSetting', { name: 'lang', value: lang })
      import(`quasar/lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    }
  }
}
</script>
