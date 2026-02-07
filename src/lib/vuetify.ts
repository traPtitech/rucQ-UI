import { h } from 'vue'
import { createVuetify, type IconSet, type IconProps } from 'vuetify'
import { aliases as mdAliases } from 'vuetify/iconsets/md'

const ms: IconSet = {
  component: (props: IconProps) => {
    const iconName = props.icon as string
    const isFilled = iconName.endsWith('_filled') // _filled でアイコンの塗りつぶしを判定
    const realIconName = isFilled ? iconName.slice(0, -7) : iconName
    return h(props.tag, { class: ['material-symbols', { fill: isFilled }] }, realIconName)
  },
}

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
  icons: {
    defaultSet: 'ms',
    aliases: mdAliases,
    sets: { ms },
  },
})
