import mongoose from "mongoose";
const Schema = mongoose.Schema;
/**

• customerSchemaは顧客のスキーマ定義です。
 */
const customerSchema = new Schema({
  customerId: Number,
  name: String,
  totalSpent: {
 type: Number,
 default: 0
  },
  thisYearSpent: {
 type: Number,
 default: 0
  }
});

/**

• spentOfYearSchemaは年ごとの支出のスキーマ定義です。
 */
const spentOfYearSchema = new Schema({
  customerId: Number,
  year: Number,
  totalSpent: Number
});

/**

• Customersモデルは顧客データのMongooseモデルです。
 */
export const Customers = mongoose.model("customers", customerSchema);

/**

• SpentOfyearsモデルは年ごとの支出データのMongooseモデルです。
 */
export const SpentOfyears = mongoose.model("spentOfyears", spentOfYearSchema);