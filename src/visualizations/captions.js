// The animations' captions (src/locales/viz.<language>.json), added to the
// translations under "viz". They're kept apart from the rest of the UI text
// so they only download with the animations, not with the first page.
import i18n from '../i18n'
import en from '../locales/viz.en.json'
import es from '../locales/viz.es.json'

i18n.addResourceBundle('en', 'translation', { viz: en }, true, true)
i18n.addResourceBundle('es', 'translation', { viz: es }, true, true)
