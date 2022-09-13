// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  defaults: {
    VTooltip: {
      location: 'top',
    },
    VTable: {
      density: 'compact',
    },
    VCheckboxBtn: {
      density: 'compact',
    },
    VCard: {
      rounded: 0,
      flat: true,
      density: 'compact',
    },
    VList: {
      density: 'compact',
      lines: false,
    },
    VBtn: {
      variant: 'text',
    },
    VTextarea: {
      density: 'compact',
      variant: 'outlined',
    },
    VTextField: {
      density: 'compact',
      variant: 'outlined',
    },
    VFileInput: {
      density: 'compact',
      variant: 'outlined',
    },
    VSelect: {
      density: 'compact',
      variant: 'outlined',
      noDataText: 'Нет данных',
    },
    VAutocomplete: {
      density: 'compact',
      variant: 'outlined',
      noDataText: 'Нет данных',
    }
  },
  theme: {
    defaultTheme: 'dark'
  },
  components,
  directives,
})
