import mongoose from "mongoose";
const Schema = mongoose.Schema;

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

export const Orders = mongoose.model("orders", OrderSchema);
