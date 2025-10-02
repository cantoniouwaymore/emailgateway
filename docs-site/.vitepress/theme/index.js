import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Breadcrumb from './components/Breadcrumb.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-after': () => h(Breadcrumb),
    })
  },
  enhanceApp({ app }) {
    // Clean theme without vitepress-openapi for now
  },
}