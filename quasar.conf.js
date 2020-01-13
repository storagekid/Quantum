// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'Vuelidate',
      'GlobalComponents',
      'helpers'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QBanner',
        'QCircularProgress',
        'QScrollArea',
        'QAvatar',
        'QForm',
        'QField',
        'QSeparator',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QIcon',
        'QList',
        'QImg',
        'QItem',
        'QItemLabel',
        'QItemSection',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QInput',
        'QSelect',
        'QCheckbox',
        'QDate',
        'QUploader',
        'QUploaderAddTrigger',
        'QInnerLoading',
        'QSpinnerGears',
        'QTable',
        'QMarkupTable',
        'QTh',
        'QTr',
        'QTd',
        'QDialog',
        'QToggle',
        'QChip',
        'QCheckbox',
        'QPageSticky',
        'QTabs',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QExpansionItem',
        'QTooltip',
        'QLinearProgress',
        'QOptionGroup',
        'QSlider',
        'QBadge',
        'QResizeObserver',
        'QSpace',
        'QPopupProxy',
        'QVirtualScroll'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'AppFullscreen',
        'LocalStorage',
        'SessionStorage'
      ],
      config: {
        loading: {
          spinner: 'QSpinnerGears',
          message: 'Cargando datos...',
          messageColor: 'white',
          spinnerSize: 100, // in pixels
          spinnerColor: 'white'
        }
      },
      // iconSet: 'ionicons-v4'
      lang: 'es' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      env: ctx.dev
        ? { // so on dev we'll have
          API: JSON.stringify('http://migabinete.test/api/rest/'),
          PUBLIC_SRC: JSON.stringify('http://migabinete.test/storage'),
          SERVER_ADDRESS: JSON.stringify('http://migabinete.test')
        }
        : { // and on build (production):
          API: JSON.stringify('http://192.168.4.16:8100/api/rest/'),
          PUBLIC_SRC: JSON.stringify('http://192.168.4.16:8100/storage'),
          SERVER_ADDRESS: JSON.stringify('http://migabinete.test')
        },
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: [
      'bounceInLeft',
      'bounceOutRight'
    ],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
