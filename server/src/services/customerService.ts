import dataAccess from "../data-access";
import { getStartDateOfYear, getThisYear } from "../utils";
import { tierService } from "./tierService";

export const customerService = {
    /**
     * create new customer record if not exist
     * @param {Customer} _customer 
     */
    newCustomer: async (_customer: Customer) => {
        const customer = await dataAccess.customerdB.findOne({ customerId: _customer.customerId });
        if (!customer) await dataAccess.customerdB.create(_customer);
    },
    /**
     * add order spent amount to total spent of year
     * @param {Order} order 
     */
    addSpent: async (order: Order) => {
        var spentOfYear: any = await dataAccess.spentOfYeardb.findOne({
            customerId: order.customerId,
            year: order.year
        });
        if (!spentOfYear) {

            spentOfYear = {
                customerId: order.customerId,
                year: order.year,
                totalSpent: 0
            }
            await dataAccess.spentOfYeardb.create(spentOfYear)
        }

        // add spent amount to total amount per year
        spentOfYear.totalSpent += order.totalInCents;

        await dataAccess.spentOfYeardb.update(
            {
                customerId: order.customerId,
                year: order.year
            },
            spentOfYear
        )

        await customerService.updateTier(order.customerId);
    },
    /**
     * update totalSpent amount for tier calculation
     * @param {number} customerId 
     */
    updateTier: async (customerId: number) => {
        const thisYear = getThisYear()
        const lastyear = thisYear - 1;

        var thisYearSpent: any = await dataAccess.spentOfYeardb.findOne({ customerId: customerId, year: thisYear });
        if (!thisYearSpent) thisYearSpent = { totalSpent: 0 }
        var lastYearSpent: any = await dataAccess.spentOfYeardb.findOne({ customerId: customerId, year: lastyear });
        if (!lastYearSpent) lastYearSpent = { totalSpent: 0 }

        const totalSpent = thisYearSpent.totalSpent + lastYearSpent.totalSpent;
        await dataAccess.customerdB.update(
            { customerId: customerId },
            {
                totalSpent: totalSpent,
                thisYearSpent: thisYearSpent.totalSpent
            }
        )
    },
    /**
     * get customer info 
     * @param customerId 
     */
    getCustomerInfo: async (customerId: number): Promise<CustomerInfo> => {
        const customerData = await dataAccess.customerdB.findOne({customerId:customerId})
        if (!customerData) throw new Error("Invalid customer Id");
        return customerService.getTierInfo(customerData);
    },
    /**
     * get customer info list
     */
    getCustomers: async (): Promise<CustomerInfo[]> => {
        const customerDatas = await dataAccess.customerdB.find({})
        const tierInfos = customerDatas.map(customerData => {
            return customerService.getTierInfo(customerData);
        })
        return tierInfos
    },
    /**
     * get tier info from customer data
     * @param customerData 
     * @returns {CustomerInfo} customer info with tier and downgrade info
     */
    getTierInfo: (customerData: Customer): CustomerInfo => {
        const { currentTier, nextTier, isMaxTier } = tierService.getTier(customerData.totalSpent);
        const thisYear = getThisYear()
        const lastyear = thisYear - 1;
        const nextyear = thisYear + 1;

        const nextYearTier = tierService.getTier(customerData.thisYearSpent);
        const isDowngraded = nextYearTier.currentTier.tierId != currentTier.tierId;

        //only one grade decrease
        const downgradeTier = currentTier.tierName === "Gold" ? 'Silver' : 'Bronze'

        return {
            customerId: customerData.customerId,
            customerName: customerData.name,
            tierName: currentTier.tierName,
            startDate: getStartDateOfYear(lastyear),
            totalSpent: customerData.totalSpent,
            thisYearSpent: customerData.thisYearSpent,
            amountForNextTier: isMaxTier ? 0 : nextTier.totalSpent - customerData.totalSpent,
            nextYearTier: !isDowngraded ? null : downgradeTier,
            endDate: getStartDateOfYear(nextyear),
            amountForKeepTier: !isDowngraded ? 0 : currentTier.totalSpent - customerData.thisYearSpent
        }

    }
}