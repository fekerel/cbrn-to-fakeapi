import { expect } from "chai";
import { productService } from "../src/api/fakeApi/ProductService";


describe("ProductService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("GET /products/{id} - should return 200", async () => {
    const response = await productService.getProductByID();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('sellerId').that.is.a('number');
    expect(response.data).to.have.property('categoryId').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('price').that.is.a('number');
    expect(response.data).to.have.property('stock').that.is.a('number');
    expect(response.data).to.have.property('variants').that.is.an('array');
    expect(response.data).to.have.property('tags').that.is.an('array');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
    if (response.data.variants.length > 0) {
      const variant = response.data.variants[0];
      expect(variant).to.have.property('id').that.is.a('string');
      expect(variant).to.have.property('color').that.is.a('string');
      expect(variant).to.have.property('size').that.is.a('string');
      expect(variant).to.have.property('price').that.is.a('number');
      expect(variant).to.have.property('stock').that.is.a('number');
    }
  })


  it("GET /products - should return 200", async () => {
    const response = await productService.getAllProducts();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("array");

    const firstData = response.data[0];
    expect(firstData).to.be.an("object");
    expect(firstData).to.have.property('id').that.is.a('number');
    expect(firstData).to.have.property('sellerId').that.is.a('number');
    expect(firstData).to.have.property('categoryId').that.is.a('number');
    expect(firstData).to.have.property('name').that.is.a('string');
    expect(firstData).to.have.property('description').that.is.a('string');
    expect(firstData).to.have.property('price').that.is.a('number');
    expect(firstData).to.have.property('stock').that.is.a('number');
    expect(firstData).to.have.property('variants').that.is.an('array');
    expect(firstData).to.have.property('tags').that.is.an('array');
    expect(firstData).to.have.property('status').that.is.a('string');
    expect(firstData).to.have.property('createdAt').that.is.a('number');
    expect(firstData).to.have.property('modifiedAt').that.is.a('number');
  });

  it("POST /products - creates new product with id", async () => {
    const response = await productService.createNewProduct();

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);

    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('sellerId');
    expect(response.data).to.have.property('categoryId');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('price').that.is.a('number');
    expect(response.data).to.have.property('stock').that.is.a('number');
    expect(response.data).to.have.property('variants').that.is.an('array');
    expect(response.data).to.have.property('tags').that.is.an('array');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  });

  it("DELETE /products/{id} - removes product (200)", async () => {
    const response = await productService.deleteProduct();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  })

  it("PUT /products/{id} - updates product (200)", async () => {
    const response = await productService.updateProduct();

    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('sellerId').that.is.a('number');
    expect(response.data).to.have.property('categoryId').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('price').that.is.a('number');
    expect(response.data).to.have.property('stock').that.is.a('number');
    expect(response.data).to.have.property('variants').that.is.an('array');
    expect(response.data).to.have.property('tags').that.is.an('array');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  })
});


