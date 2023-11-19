import mongoose from "mongoose";
/**

• DBAccesssクラスは、Mongooseモデルに対するデータベースアクセスを提供します。
 */
export class DBAccesss {
    private model: mongoose.Model<any>;

    /**
  
  • DBAccesssクラスのコンストラクタ
  • @param _model Mongooseモデル
     */
    public constructor(_model: mongoose.Model<any>) {
        this.model = _model;
    }

    /**
  
  • データを作成します。
  • @param data 作成するデータ
  • @returns 作成されたデータ
     */
    public async create(data: any) {
        const newData = new this.model(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("AuthDB Database Error");
        }
        return saveData;
    }

    /**
  
  • 条件に一致する最初のデータを検索します。
  • @param filter 検索条件
  • @returns 検索されたデータ
     */
    public async findOne(filter: any) {
        return this.model.findOne(filter);
    }

    /**
  
  • 条件に一致するデータを検索します。
  • @param filter 検索条件
  • @returns 検索されたデータの配列
     */
    public async find(filter: any) {
        return this.model.find(filter);
    }

    /**
  
  • 条件に一致するデータを更新します。
  • @param filter 更新条件
  • @param update 更新内容
  • @returns 更新されたデータ
     */
    public async update(filter: any, update: any) {
        return this.model.findOneAndUpdate(filter, update);
    }

}
