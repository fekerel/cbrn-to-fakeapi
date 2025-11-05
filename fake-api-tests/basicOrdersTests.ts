import { expect } from "chai"
import { orderService } from "@/api/fakeApi/OrderService";

describe("Order Test", async () => {
    it("Create New Order", async () => {
        const response = await orderService.createNewOrder();
        expect(response).to.be.equal(201);

    });

    it("Get All Orders", async () => {
        const response = await orderService.getAllOrders();
        expect(response).to.be.an("array");

    });

    it("Get Order By ID", async () => {
        const response = await orderService.getOrderByID();
        expect(response).to.be.an("object");

    });

    it("Update Order By ID", async () => {
        const response = await orderService.updateOrderByID();
        expect(response).to.be.an("object");

    });

    it.only("Delete Order By ID", async () => {
        const response = await orderService.deleteOrderByID();
        expect(response).to.be.equal(200);

    });
})