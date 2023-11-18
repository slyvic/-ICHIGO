import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import morgan from 'morgan' // 外部モジュール
import Routes from "./Routes"; // ルーターを取得

const router: express.Router = express.Router();
const app: express.Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 200, // 各IPアドレスごとに15分間に100リクエストまで制限
  standardHeaders: true, // `RateLimit-*`ヘッダーにレート制限情報を含める
  legacyHeaders: false, // `X-RateLimit-*`ヘッダーを無効化
});

const DATABASE = 'mongodb://localhost:27017/tier-test'
const PORT = 8000

const connectDatabase = async (mongoUrl: string) => {
  try {
    const options = {
      autoCreate: true,
      keepAlive: true,
      retryReads: true,
    } as mongoose.ConnectOptions;

    mongoose.set("strictQuery", true);

    const result = await mongoose.connect(mongoUrl, options);

    if (result) {
      console.log("MongoDBに接続しました");
    }

    return result;
  } catch (err) {
    console.log("ConnectDatabaseエラー", err);
  }
};

// ミドルウェア
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(morgan('tiny'))
app.use(limiter)
app.use(express.json());

connectDatabase(DATABASE).then(() => {
  // APIルーター
  Routes(router);
  app.use("/api", router);

  app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
  });
}).catch((err: any) => {
  console.log(err);
});

export default app;