import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from './en.json'
import koTranslation from './ko.json'

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: enTranslation },
		ko: { translation: koTranslation },
	},
	lng: 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
