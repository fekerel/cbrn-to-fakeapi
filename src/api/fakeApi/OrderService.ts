import ApiService from "../ApiService";
import { buildRandomOrderBody } from "@common/fakeApi/Utils";

class OrderService {
    private api = ApiService.getInstance().instance;

    public async createOrder(body?: any) {
        // POST /orders
        const payload = body ?? buildRandomOrderBody();
        return this.api.post('/orders', payload);
    }

    public async getAllOrders() {
        // GET /orders
        return this.api.get('/orders');
    }

    public async getOrderById(id: number) {
        // GET /orders/{id}
        return this.api.get(`/orders/${id}`);
    }

    public async updateOrderById(id: number, body: any) {
        // PUT /orders/{id}
        const payload = body ?? buildRandomOrderBody();
        return this.api.put(`/orders/${id}`, payload);
    }

    public async deleteOrderById(id: number) {
        // DELETE /orders/{id}
        return this.api.delete(`/orders/${id}`);
    }
}

export const orderService = new OrderService();