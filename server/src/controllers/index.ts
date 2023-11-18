import { Response, Request } from "express";
import service from "../services";
import { checkIfNumber, checkIfString, getThisYear } from "../utils";
import cron from "node-cron";

export default {
	newOrder: async (req: Request, res: Response) => {
		try {
			const { orderId, customerId, totalInCents, date, customerName } = req.body;
			// validation
			if (!checkIfString(orderId)) throw new Error("orderId invalid");
			if (!checkIfString(date)) throw new Error("date invalid");
			if (!checkIfString(customerName)) throw new Error("customerName invalid");
			if (!checkIfString(customerId)) throw new Error("customerId invalid");
			if (!checkIfNumber(totalInCents)) throw new Error("totalInCents invalid");

			await service.customerService.newCustomer({
				customerId: customerId,
				name: customerName
			})

			const order: Order = {
				orderId: orderId,
				customerId: customerId,
				customerName: customerName,
				totalInCents: totalInCents,
				date: date,
				year: getThisYear(date)
			}
			await service.orderService.saveOrder(order);
			await service.customerService.addSpent(order);
			console.log("order added");
			return res.status(200).json({ status: "success" });
		} catch (err) {
			console.log("newOrder", err);
			return res.status(400).send({ status: "internal error" });
		}
	},
	getTier: async (req: Request, res: Response) => {
		
		try {
			const customerId = req.params.customerId;

			if (!checkIfString(customerId)) throw new Error("customerId invalid");
			const tierInfo: CustomerInfo = await service.customerService.getCustomerInfo(parseInt(customerId));
			return res.status(200).json(tierInfo);
		} catch (err) {
			console.log("getTier", err);
			return res.status(400).send({ status: "internal error" });
		}
	},
	getCustomers: async (req: Request, res: Response) => {
		try {
			const tierInfos: CustomerInfo[] = await service.customerService.getCustomers();
			return res.status(200).json(tierInfos);
		} catch (err) {
			console.log("getCustomers", err);
			return res.status(400).send({ status: "internal error" });
		}
	},
	getOrders: async (req: Request, res: Response) => {
		try {
			//can add page_number and page_size
			const { customerId} = req.body;
			const customerid=parseInt(customerId)

			// if (!checkIfNumber(customerid)) throw new Error("customerId invalid");
			// if (!checkIfNumber(page_number)) throw new Error("page_number invalid");
			// if (!checkIfNumber(page_size)) throw new Error("page_size invalid");

			// if (page_number < 1 || page_size < 0) throw new Error("Invalid pagination parameter")
			const thisYear = getThisYear()
			const lastyear = thisYear - 1;
			const lastyearOrders: Order[] = await service.orderService.orderOfYear(customerid, lastyear);
			const thisyearOrders: Order[] = await service.orderService.orderOfYear(customerid, thisYear);

			var orders = [...lastyearOrders, ...thisyearOrders];
			orders = orders.map((order: Order) => {
				return {
					orderId: order.orderId,
					customerId: order.customerId,
					customerName:order.customerName,
					totalInCents: order.totalInCents,
					date: order.date,
					year: order.year
				}
			})
			// const startId = (page_number - 1) * page_size;
			// const pageOrders = orders.slice(startId, startId + page_size);
			return res.status(200).json(orders);

		} catch (err) {
			console.log("getOrders", err);
			return res.status(400).send({ status: "internal error" });
		}
	}
}

const tierUpdator = async () => {
	try {
		const tierInfos: CustomerInfo[] = await service.customerService.getCustomers();
		tierInfos.map(async (customer) => {
			await service.customerService.updateTier(customer.customerId);
		})
	} catch (err: any) {
		console.log("tierUpdator", err.message);
	}
}

export const updator = () => {
	cron.schedule('*/10 * * * * *', () => {
		tierUpdator()
	});
}