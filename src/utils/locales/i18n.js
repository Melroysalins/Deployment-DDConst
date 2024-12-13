import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend';

// import enTranslation from './en.json'
// import koTranslation from './ko.json'

i18n.use(initReactI18next).use(Backend).init({
	debug: true,
	lng: 'ko',
	fallbackLng: 'ko',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
