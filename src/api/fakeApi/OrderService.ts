import addOrderJSON from "@api/body/fakeApi/addOrder.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";

class OrderService {
    public async addOrder(orderData: DeepPartial<typeof addOrderJSON> = {}) {
        const overrides = orderData;
        const body = merge({}, addOrderJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/orders", body);
        return res;
    }
}

export const orderService = new OrderService();