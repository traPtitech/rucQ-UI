import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#f6f6f6',
          surface: '#ffffff',
          primary: '#ff7300',
          secondary: '#444444',
          primaryLight: '#FFE5C9',
          text: '#000000',
          patternOnPrimary: '#FF8200',
          line: '#C0C0C0',
          orange: '#FB8C00', // Vuetify の orange-darken-1
          pink: '#FF80AB', // Vuetify の pink-accent-1
        },
      },
    },
  },
})
