import dataAccess from "../data-access";
import { getStartDateOfYear, getThisYear } from "../utils";
import { tierService } from "./tierService";

export const customerService = {
  /**
   * 新しい顧客レコードを作成（存在しない場合）
   * @param {Customer} _customer - 顧客情報
   */
  newCustomer: async (_customer: Customer) => {
    const customer = await dataAccess.customerdB.findOne({ customerId: _customer.customerId });
    if (!customer) await dataAccess.customerdB.create(_customer);
  },

  /**
   * 注文の支出金額を年間の総支出に追加する
   * @param {Order} order - 注文情報
   */
  addSpent: async (order: Order) => {
    var spentOfYear: any = await dataAccess.spentOfYeardb.findOne({ customerId: order.customerId, year: order.year });
    if (!spentOfYear) {
      spentOfYear = { customerId: order.customerId, year: order.year, totalSpent: 0 };
      await dataAccess.spentOfYeardb.create(spentOfYear);
    }

    // 総支出に支出金額を追加
    spentOfYear.totalSpent += order.totalInCents;

    await dataAccess.spentOfYeardb.update(
      { customerId: order.customerId, year: order.year },
      spentOfYear
    );

    await customerService.updateTier(order.customerId);
  },

  /**
   * ティア計算のために総支出金額を更新する
   * @param {number} customerId - 顧客ID
   */
  updateTier: async (customerId: number) => {
    const thisYear = getThisYear();
    const lastyear = thisYear - 1;

    var thisYearSpent: any = await dataAccess.spentOfYeardb.findOne({ customerId: customerId, year: thisYear });
    if (!thisYearSpent) thisYearSpent = { totalSpent: 0 };

    var lastYearSpent: any = await dataAccess.spentOfYeardb.findOne({ customerId: customerId, year: lastyear });
    if (!lastYearSpent) lastYearSpent = { totalSpent: 0 };

    const totalSpent = thisYearSpent.totalSpent + lastYearSpent.totalSpent;

    await dataAccess.customerdB.update(
      { customerId: customerId },
      { totalSpent: totalSpent, thisYearSpent: thisYearSpent.totalSpent }
    );
  },

  /**
   * 顧客情報を取得する
   * @param {number} customerId - 顧客ID
   * @returns {Promise} - 顧客情報のPromiseオブジェクト
   */
  getCustomerInfo: async (customerId: number): Promise<CustomerInfo> => {
    const customerData = await dataAccess.customerdB.findOne({ customerId: customerId });
    if (!customerData) throw new Error("無効な顧客IDです");

    return customerService.getTierInfo(customerData);
  },

  /**
   * 顧客情報リストを取得する
   * @returns {Promise} - 顧客情報リストのPromiseオブジェクト
   */
  getCustomers: async (): Promise<CustomerInfo[]> => {
    const customerDatas = await dataAccess.customerdB.find({});
    const tierInfos = customerDatas.map((customerData) => {
      return customerService.getTierInfo(customerData);
    });

    return tierInfos;
  },

  /**
   * 顧客データからティア情報を取得する
   * @param {Customer} customerData - 顧客データ
   * @returns {CustomerInfo} - ティア情報を含む顧客情報
   */
  getTierInfo: (customerData: Customer): CustomerInfo => {
    const { currentTier, nextTier, isMaxTier } = tierService.getTier(customerData.totalSpent);
    const thisYear = getThisYear();
    const lastyear = thisYear - 1;
    const nextyear = thisYear + 1;
    const nextYearTier = tierService.getTier(customerData.thisYearSpent);
    const isDowngraded = nextYearTier.currentTier.tierId !== currentTier.tierId; // ティアが1つ下がる場合のみ
    const downgradeTier = currentTier.tierName === "Gold" ? 'Silver' : 'Bronze'; // ティアが下がる場合のティア名

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
      amountForKeepTier: !isDowngraded ? 0 : currentTier.totalSpent - customerData.thisYearSpent,
    };
  },
};

export default customerService;