import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
• OrderSchemaは注文のスキーマ定義です。
 */
const OrderSchema = new Schema({
	orderId: String,
	customerId: Number,
	customerName: String,
	totalInCents: Number,
	date: String,
	year: {
		type: Number,
		index: true
	}
});

/**
• Ordersモデルは注文データのMongooseモデルです。
 */
export const Orders = mongoose.model("orders", OrderSchema);