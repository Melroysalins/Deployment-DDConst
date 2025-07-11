// workDaysEditor.js
import { Editor } from '../../lib/bryntum/schedulerpro.module'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/themes/light.css'

export default class DateRangeEditor extends Editor {
	render() {
		const record = this.editorContext?.record || this.record

		this.fp = flatpickr(this.element, {
			mode: 'range',
			dateFormat: 'd/m/Y',
			defaultDate: record?.startDate && record?.endDate ? [record.startDate, record.endDate] : null,
			onClose: (selectedDates) => {
				if (selectedDates.length === 2 && record) {
					const [start, end] = selectedDates
					record.set('startDate', start)
					record.set('endDate', end)
					record.set('workDays', `${start.toLocaleDateString('en-GB')} - ${end.toLocaleDateString('en-GB')}`)
				}
				this.trigger('complete')
			},
		})

		this.fp.open()
	}

	static get isPopup() {
		return true
	}

	doDestroy() {
		this.fp?.destroy()
		super.doDestroy()
	}
}
