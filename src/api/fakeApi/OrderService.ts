import { DeepPartial } from "@/common/fakeApi/Types";
import ApiService from "../ApiService";
import { randomPassword, buildRandomOrderBody } from "@/common/fakeApi/Utils";
import { AxiosResponse } from "axios";
import { merge } from "lodash";
import addOrderJSON from "@api/body/fakeApi/addOrder.json";

class OrderService {

    public async addOrder(orderData: DeepPartial<typeof addOrderJSON> = {}) {
        const overrides = orderData;
        const body = merge({}, addOrderJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/orders", body);
        return res;
    }

    public async getAllOrders() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders`);
        return response;
    }

    public async getOrderOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/orders/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getRandomOrder() {
        const orders = (await this.getAllOrders()).data;
        const randomIndex = Math.floor(Math.random() * orders.length);
        return orders[randomIndex];
    }

    public async getOrderByID() {
        const order = await this.getRandomOrder();
        const response = await ApiService.getInstance().instance.get(`/orders/${order.id}`);
        if (response.data.id !== order.id || response.status !== 200) {
            return false;
        }
        return response;
    }

    public async updateOrder() {
        const order = await this.getRandomOrder();
        if (!order || !order.id) {
            return false;
        }
        const newStatus = "delivered";
        const updateBody = {
            ...order,
            status: newStatus
        };
        const response = await ApiService.getInstance().instance.put(`/orders/${order.id}`, updateBody);
        if (response.status !== 200)
            return false;
        const updatedOrder = await this.getOrderOnlyByID(order.id);
        if (typeof updatedOrder !== "object") {
            return false;
        }
        if (updatedOrder.data.id === order.id && updatedOrder.data.status === newStatus)
            return updatedOrder;
        return false;
    }

    public async deleteOrder() {
        const order = await this.getRandomOrder();
        if (!order || !order.id) {
            return false;
        }
        const response = await ApiService.getInstance().instance.delete(`/orders/${order.id}`);
        if (response.status !== 200)
            return false;
        const deletedOrderList = (await this.getAllOrders()).data;
        const isFalse = deletedOrderList.some((ord) => ord.id === order.id);
        if (isFalse)
            return false;
        return response
    }

    public async createNewOrder() {
        // Get a user
        const usersResponse = await ApiService.getInstance().instance.get("/users");
        const users = usersResponse.data;
        if (!users || users.length === 0) {
            throw new Error("No users found");
        }
        const user = users[Math.floor(Math.random() * users.length)];

        // Get a product
        const productsResponse = await ApiService.getInstance().instance.get("/products");
        const products = productsResponse.data;
        if (!products || products.length === 0) {
            throw new Error("No products found");
        }
        const product = products[Math.floor(Math.random() * products.length)];

        const body = buildRandomOrderBody({
            userId: user.id,
            items: [{
                productId: product.id,
                variantId: product.variants && product.variants.length > 0 ? product.variants[0].id : null,
                quantity: 1,
                price: product.price
            }]
        });

        const response = await ApiService.getInstance().instance.post("/orders", JSON.parse(JSON.stringify(body)));
        if (response.status !== 201) {
            throw new Error(`Failed to create order. Status code: ${response.status}`);
        }
        return response
    }

    public async getOrdersCancellationAnalysis() {
        const response = await ApiService.getInstance().instance.get("/orders/cancellation-analysis");
        return response;
    }

    public async createOrder() {
        const usersResponse = await ApiService.getInstance().instance.get("/users");
        const users = usersResponse.data;
        if (!users || users.length === 0) {
            throw new Error("No users found");
        }
        const user = users[Math.floor(Math.random() * users.length)];

        const productsResponse = await ApiService.getInstance().instance.get("/products");
        const products = productsResponse.data;
        if (!products || products.length === 0) {
            throw new Error("No products found");
        }
        const product = products[Math.floor(Math.random() * products.length)];

        const body = buildRandomOrderBody({
            userId: user.id,
            items: [{
                productId: product.id,
                variantId: product.variants && product.variants.length > 0 ? product.variants[0].id : null,
                quantity: 1,
                price: product.price
            }]
        });

        const response = await ApiService.getInstance().instance.post("/orders/create", JSON.parse(JSON.stringify(body)));
        return response;
    }

    public async filterOrders() {
        const response = await ApiService.getInstance().instance.get("/orders/filter?status=pending");
        return response;
    }

    public async fulfillOrder() {
        const order = await this.getRandomOrder();
        if (!order || !order.id) {
            throw new Error("No order found");
        }
        const body = {
            orderId: order.id,
            status: "fulfilled"
        };
        const response = await ApiService.getInstance().instance.post("/orders/fulfill", body);
        return response;
    }

    public async getOrdersFulfillmentStatus() {
        const response = await ApiService.getInstance().instance.get("/orders/fulfillment-status");
        return response;
    }

    public async getOrderDetails() {
        const order = await this.getRandomOrder();
        if (!order || !order.id) {
            throw new Error("No order found");
        }
        const response = await ApiService.getInstance().instance.get(`/orders/${order.id}/details`);
        return response;
    }

    public async searchOrders() {
        const body = {
            query: "test",
            status: "pending"
        };
        const response = await ApiService.getInstance().instance.post("/orders/search", body);
        return response;
    }

    public async getRecentOrders() {
        const response = await ApiService.getInstance().instance.get("/orders/recent");
        return response;
    }

    public async getOrdersStatistics() {
        const response = await ApiService.getInstance().instance.get("/orders/statistics");
        return response;
    }
}

export const orderService = new OrderService();

