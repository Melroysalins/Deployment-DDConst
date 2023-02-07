export interface IContract {
	contractedSource: string
	service: 'Full' | 'Partial'
	voltage: number
	location: string
	construction_type: string
	branch: number // id
	title: string
	contract_code: number
	start: string
	end: string
	contract_value: number
	contract_value_vat: number
	contract_value_vat_written: string
	contract_value_price: number
	contract_value_price_written: string
	adjustment_rate: number
	deposit_rate: number
	warranty_period: string
	compensation_rate: number
}
