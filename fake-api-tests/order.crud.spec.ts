import { expect } from "chai";
import { orderService } from "../src/api/fakeApi/OrderService";


describe("OrderService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("GET /orders/{id} - should return 200", async () => {
    const response = await orderService.getOrderByID();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('userId').that.is.a('number');
    expect(response.data).to.have.property('items').that.is.an('array');
    expect(response.data).to.have.property('totalAmount').that.is.a('number');
    expect(response.data).to.have.property('shippingAddress').that.is.an('object');
    expect(response.data).to.have.property('payment').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
    expect(response.data.shippingAddress).to.have.property('street').that.is.a('string');
    expect(response.data.shippingAddress).to.have.property('city').that.is.a('string');
    expect(response.data.shippingAddress).to.have.property('country').that.is.a('string');
    expect(response.data.shippingAddress).to.have.property('zipCode').that.is.a('string');
    expect(response.data.payment).to.have.property('method').that.is.a('string');
    expect(response.data.payment).to.have.property('status').that.is.a('string');
    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      expect(item).to.have.property('productId').that.is.a('number');
      expect(item).to.have.property('variantId');
      expect(item).to.have.property('quantity').that.is.a('number');
      expect(item).to.have.property('price').that.is.a('number');
    }
  })


  it("GET /orders - should return 200", async () => {
    const response = await orderService.getAllOrders();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("array");

    const firstData = response.data[0];
    expect(firstData).to.be.an("object");
    expect(firstData).to.have.property('id').that.is.a('number');
    expect(firstData).to.have.property('userId').that.is.a('number');
    expect(firstData).to.have.property('items').that.is.an('array');
    expect(firstData).to.have.property('totalAmount').that.is.a('number');
    expect(firstData).to.have.property('shippingAddress').that.is.an('object');
    expect(firstData).to.have.property('payment').that.is.an('object');
    expect(firstData).to.have.property('status').that.is.a('string');
    expect(firstData).to.have.property('createdAt').that.is.a('number');
    expect(firstData).to.have.property('modifiedAt').that.is.a('number');
  });

  it("POST /orders - creates new order with id", async () => {
    const response = await orderService.createNewOrder();

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);

    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('userId').that.is.a('number');
    expect(response.data).to.have.property('items').that.is.an('array');
    expect(response.data).to.have.property('totalAmount').that.is.a('number');
    expect(response.data).to.have.property('shippingAddress').that.is.an('object');
    expect(response.data).to.have.property('payment').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  });

  it("DELETE /orders/{id} - removes order (200)", async () => {
    const response = await orderService.deleteOrder();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  })

  it("PUT /orders/{id} - updates order (200)", async () => {
    const response = await orderService.updateOrder();

    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('userId').that.is.a('number');
    expect(response.data).to.have.property('items').that.is.an('array');
    expect(response.data).to.have.property('totalAmount').that.is.a('number');
    expect(response.data).to.have.property('shippingAddress').that.is.an('object');
    expect(response.data).to.have.property('payment').that.is.an('object');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  })
});


