import ApiService from "../ApiService";

class OrderService {
    // CRUD stubs only for experiment.

    public async createOrder(body?: any) {
        // AI: POST /orders
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getAllOrders() {
        // AI: GET /orders
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getOrderById(id: number) {
        // AI: GET /orders/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async updateOrderById(id: number, body: any) {
        // AI: PUT /orders/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async deleteOrderById(id: number) {
        // AI: DELETE /orders/{id}
        throw new Error("NOT_IMPLEMENTED");
    }
}

export const orderService = new OrderService();