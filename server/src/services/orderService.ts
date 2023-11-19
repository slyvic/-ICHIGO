import dataAccess from "../data-access";

export const orderService = {
  /**
   * 注文情報を保存する
   * @param {Order} order - 注文情報
   */
  saveOrder: async (order: Order) => {
    await dataAccess.orderdB.create(order);
  },

  /**
   * 指定された年の注文情報を取得する
   * @param {number} customerId - 顧客ID
   * @param {number} year - 年
   * @returns {Promise} - 注文情報のPromiseオブジェクト
   */
  orderOfYear: async (customerId: number, year: number) => {
    if (!customerId) {
      return await dataAccess.orderdB.find({ year: year });
    }
    return await dataAccess.orderdB.find({ customerId: customerId, year: year });
  }
};

export default orderService;