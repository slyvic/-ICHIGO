import { Response, Request } from "express";
import service from "../services";
import { checkIfNumber, checkIfString, getThisYear } from "../utils";
import cron from "node-cron";

export default {
  // 新しい注文を作成するメソッド
  newOrder: async (req: Request, res: Response) => {
    try {
      const { orderId, customerId, totalInCents, date, customerName } = req.body;
      // バリデーション
      if (!checkIfString(orderId)) throw new Error("orderIdが無効です");
      if (!checkIfString(date)) throw new Error("日付が無効です");
      if (!checkIfString(customerName)) throw new Error("顧客名が無効です");
      if (!checkIfString(customerId)) throw new Error("顧客IDが無効です");
      if (!checkIfNumber(totalInCents)) throw new Error("金額が無効です");

      // 顧客情報を保存
      await service.customerService.newCustomer({
        customerId: customerId,
        name: customerName
      });

      // 注文情報を作成
      const order = {
        orderId: orderId,
        customerId: customerId,
        customerName: customerName,
        totalInCents: totalInCents,
        date: date,
        year: getThisYear(date)
      };

      // 注文情報を保存
      await service.orderService.saveOrder(order);

      // 顧客の支出を更新
      await service.customerService.addSpent(order);

      console.log("注文が追加されました");
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.log("newOrder", err);
      return res.status(400).send({ status: "内部エラー" });
    }
  },

  // 特定の顧客のティア情報を取得するメソッド
  getTier: async (req: Request, res: Response) => {
    try {
      const customerId = req.params.customerId;

      if (!checkIfString(customerId)) throw new Error("顧客IDが無効です");

      // 顧客のティア情報を取得
      const tierInfo = await service.customerService.getCustomerInfo(parseInt(customerId));
      return res.status(200).json(tierInfo);
    } catch (err) {
      console.log("getTier", err);
      return res.status(400).send({ status: "内部エラー" });
    }
  },

  // すべての顧客のティア情報を取得するメソッド
  getCustomers: async (req: Request, res: Response) => {
    try {
      // すべての顧客のティア情報を取得
      const tierInfos = await service.customerService.getCustomers();
      return res.status(200).json(tierInfos);
    } catch (err) {
      console.log("getCustomers", err);
      return res.status(400).send({ status: "内部エラー" });
    }
  },

  // 特定の顧客の注文情報を取得するメソッド
  getOrders: async (req: Request, res: Response) => {
    try {
      const { customerId } = req.body;
      const customerid = parseInt(customerId);

      const thisYear = getThisYear();
      const lastyear = thisYear - 1;

      // 前年と今年の注文情報を取得
      const lastyearOrders = await service.orderService.orderOfYear(customerid, lastyear);
      const thisyearOrders = await service.orderService.orderOfYear(customerid, thisYear);

      // 注文情報を結合
      let orders = [...lastyearOrders, ...thisyearOrders];
      orders = orders.map((order) => {
        return {
          orderId: order.orderId,
          customerId: order.customerId,
          customerName: order.customerName,
          totalInCents: order.totalInCents,
          date: order.date,
          year: order.year
        };
      });

      return res.status(200).json(orders);
    } catch (err) {
      console.log("getOrders", err);
      return res.status(400).send({ status: "内部エラー" });
    }
  }
};

// ティア情報を定期的に更新するメソッド
const tierUpdator = async () => {
  try {
    // すべての顧客のティア情報を取得
    const tierInfos = await service.customerService.getCustomers();
    tierInfos.map(async (customer) => {
      // ティア情報を更新
      await service.customerService.updateTier(customer.customerId);
    });
  } catch (err: any) {
    console.log("tierUpdator", err.message);
  }
};

// ティア情報の更新を定期的に実行するメソッド
export const updator = () => {
  cron.schedule("*/10 * * * * *", () => {
    tierUpdator();
  });
};