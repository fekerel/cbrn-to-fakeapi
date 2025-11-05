import addOrderJSON from "@api/body/fakeApi/addOrder.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";
import { userService } from "./UserService";
import { randomInt } from "crypto";
import { AxiosResponse } from "axios";
import ConfigUtils from "@/common/ConfigUtils";
import { productService } from "./ProductsService";

class OrderService {
    public async addOrder(orderData: DeepPartial<typeof addOrderJSON> = {}) {
        const overrides = orderData;
        const body = merge({}, addOrderJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/orders", body);
        return res;
    }

    public async addOrderData() {
        const userList = await userService.getAllUsers();
        const userID = userList[randomInt(userList.length)].id;
        const randomProduct = await productService.randomProduct();
        const items = [{
            productId: randomProduct.id,
            variantId: randomProduct.variants[0].id,
            quantity: 1,
            price: randomProduct.price
        }];
        const totalAmount = Math.random() * 100;
        const shippingAddress = userList.find((u) => u.id === userID)?.address;
        const paymentMethod = ["credit_card", "paypal", "bank_transfer"][randomInt(3)];
        const status = ["pending", "processing", "shipped", "delivered", "cancelled"][randomInt(5)];
        const lastStatus = ["delivered", "cancelled", "returned", "failed"][randomInt(4)];
        const addData = {
            id: null,
            userId: userID,
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            payment: { method: paymentMethod, status: status },
            status: lastStatus
        }
        return addData
    }

    public async createNewOrder() {
        const addData = await this.addOrderData();
        const orderData = merge({}, addOrderJSON, addData);
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/orders`, JSON.parse(JSON.stringify(orderData)));
        return response;
    }

    public async getAllOrders() {
        return (await ApiService.getInstance().instance.get(`/orders`)).data;
    }

    public async randomOrder() {
        const allOrders = await this.getAllOrders();
        return allOrders[Math.floor(Math.random() * allOrders.length)];

    }

    public async getOrderOnlyByID(id: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${id}`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.id !== id)
            return false;
        return response.data;
    }


    public async getOrderByID() {
        const randomOrder = await this.randomOrder();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${randomOrder.id}`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.id !== randomOrder.id)
            return false;
        return response.data;
    }

    public async updateOrderByID() {
        const randomOrderData = await this.randomOrder();
        const newID = await ConfigUtils.generateUniqueWord2();
        randomOrderData.items[0].variantId = newID;
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/orders/${randomOrderData.id}`, randomOrderData);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        const updatedData = await this.getOrderOnlyByID(randomOrderData.id);
        if (updatedData.id !== randomOrderData.id || updatedData.items[0].variantId !== newID)
            return false;
        return updatedData;
    }

    public async deleteOrderByID() {
        const randomOrder = await this.randomOrder();
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/orders/${randomOrder.id}`);
        if (response.status !== 200)
            return false;
        const allOrders = await this.getAllOrders();
        const isFalse = allOrders.some((o) => o.id === randomOrder.id);
        if (isFalse)
            return false;
        return response.status;

    }
}

export const orderService = new OrderService();