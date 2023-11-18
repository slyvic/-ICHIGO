interface Order {
	orderId: string,
	customerId: number,
	customerName:string,
	totalInCents: number,
	date: string,
	year: Number
}

interface Tier {
	tierId: number,
	totalSpent: number,
	tierName: string
}

interface Customer {
	customerId: number,
	name: string,
	totalSpent?: number,
	thisYearSpent?: number
}

interface CustomerInfo {
	customerId: number,
	customerName: string,
	tierName: string,
	startDate: string,
	totalSpent: number,
	thisYearSpent:number,
	amountForNextTier: number,
	nextYearTier: string,
	endDate: string
	amountForKeepTier: number
}

interface Tiers {
	currentTier: Tier,
	nextTier: Tier,
	isMaxTier: boolean
}