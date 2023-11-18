import mongoose from "mongoose";

export class DBAccesss {
    private model: mongoose.Model<any>;

    public constructor(_model: mongoose.Model<any>) {
        this.model = _model
    }
    public async create(data: any) {
        const newData = new this.model(data);
        const saveData = await newData.save();
        if (!saveData) {
            throw new Error("AuthDB Database Error");
        }
        return saveData;
    };
    public async findOne(filter: any) {
        return this.model.findOne(filter);
    };
    public async find(filter: any) {
        return this.model.find(filter);
    };
    
    public async update(filter: any, update: any) {
        return this.model.findOneAndUpdate(
            filter,
            update
        );
    };
    public async remove(filter: any) {
        const res: any = await this.model.deleteOne(filter);
        return {
            found: res.n,
            deleted: res.deletedCount
        };
    }
}
