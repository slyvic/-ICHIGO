import express from "express";
import controllers, { updator } from "./controllers";

// ティア情報の更新サービスを実行
updator();

const Routes = (router: express.Router) => {
  // 新しい注文のエンドポイント
  router.post("/newOrder", controllers.newOrder);

  // 顧客情報のエンドポイント
  router.get("/customers", controllers.getCustomers);
  router.get("/customers/:customerId", controllers.getTier);

  // 注文情報のエンドポイント
  router.post("/orders", controllers.getOrders);
};

export default Routes;