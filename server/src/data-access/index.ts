import Models from "../models";
import { DBAccesss } from "./base";

const orderdB = new DBAccesss(Models.Orders)
const customerdB = new DBAccesss(Models.Customers)
const spentOfYeardb = new DBAccesss(Models.SpentOfyears)

export default {
    orderdB,
    customerdB,
    spentOfYeardb
};