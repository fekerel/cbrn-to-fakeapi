import { expect } from "chai"
import { orderService } from "@/api/fakeApi/OrderService";
import exp from "constants";

describe("Order Test", async () => {
    it("Create New Order", async () => {
        const response = await orderService.createNewOrder();

        expect(response.status).to.be.equal(201)
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('items').that.is.an('array');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data).to.have.property('shippingAddress').that.is.an('object');
        expect(response.data).to.have.property('payment').that.is.an('object');
        expect(response.data).to.have.property('status').that.is.a('string');

        expect(response.data.items[0]).to.have.all.keys([
            'productId',
            'variantId',
            'quantity',
            'price'
        ]);

        expect(response.data.payment).to.have.property('method').that.is.oneOf([
            'credit_card',
            'paypal',
            'bank_transfer'
        ]);

        expect(response.data.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed"
        ]);

        expect(response.data.payment.status).to.be.oneOf([
            "pending", "processing", "shipped", "delivered", "cancelled"
        ]);

    });

    it("Get All Orders", async () => {
        const response = await orderService.getAllOrders();

        expect(response).to.be.an("array");
        const firstOrder = response[0];

        expect(firstOrder).to.be.an("object");
        expect(firstOrder).to.have.property('id').that.is.a('number');
        expect(firstOrder).to.have.property('userId').that.is.a('number');
        expect(firstOrder).to.have.property('items').that.is.an('array');
        expect(firstOrder).to.have.property('totalAmount').that.is.a('number');
        expect(firstOrder).to.have.property('shippingAddress').that.is.an('object');
        expect(firstOrder).to.have.property('payment').that.is.an('object');
        expect(firstOrder).to.have.property('status').that.is.a('string');

        expect(firstOrder.items[0]).to.have.all.keys([
            'productId',
            'variantId',
            'quantity',
            'price'
        ]);

        expect(firstOrder.payment).to.have.property('method').that.is.oneOf([
            'credit_card',
            'paypal',
            'bank_transfer'
        ]);

        expect(firstOrder.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed"
        ]);

        expect(firstOrder.payment.status).to.be.oneOf([
            "pending", "processing", "shipped", "delivered", "cancelled"
        ]);

    });

    it("Get Order By ID", async () => {
        const response = await orderService.getOrderByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('id').that.is.a('number');
        expect(response).to.have.property('userId').that.is.a('number');
        expect(response).to.have.property('items').that.is.an('array');
        expect(response).to.have.property('totalAmount').that.is.a('number');
        expect(response).to.have.property('shippingAddress').that.is.an('object');
        expect(response).to.have.property('payment').that.is.an('object');
        expect(response).to.have.property('status').that.is.a('string');

        expect(response.items[0]).to.have.all.keys([
            'productId',
            'variantId',
            'quantity',
            'price'
        ]);

        expect(response.payment).to.have.property('method').that.is.oneOf([
            'credit_card',
            'paypal',
            'bank_transfer'
        ]);

        expect(response.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed"
        ]);

        expect(response.payment.status).to.be.oneOf([
            "pending", "processing", "shipped", "delivered", "cancelled"
        ]);

    });

    it("Update Order By ID", async () => {
        const response = await orderService.updateOrderByID();
        expect(response).to.be.an("object");
        expect(response).to.have.property('id').that.is.a('number');
        expect(response).to.have.property('userId').that.is.a('number');
        expect(response).to.have.property('items').that.is.an('array');
        expect(response).to.have.property('totalAmount').that.is.a('number');
        expect(response).to.have.property('shippingAddress').that.is.an('object');
        expect(response).to.have.property('payment').that.is.an('object');
        expect(response).to.have.property('status').that.is.a('string');

        expect(response.items[0]).to.have.all.keys([
            'productId',
            'variantId',
            'quantity',
            'price'
        ]);

        expect(response.payment).to.have.property('method').that.is.oneOf([
            'credit_card',
            'paypal',
            'bank_transfer'
        ]);

        expect(response.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed"
        ]);

        expect(response.payment.status).to.be.oneOf([
            "pending", "processing", "shipped", "delivered", "cancelled"
        ]);


    });

    it("Delete Order By ID", async () => {
        const response = await orderService.deleteOrderByID();
        expect(response).to.be.equal(200);

    });
})