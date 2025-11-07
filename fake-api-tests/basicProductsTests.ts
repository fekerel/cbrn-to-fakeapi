import { expect } from "chai"
import { productService } from "@/api/fakeApi/ProductsService";


describe.only("Products Test", async () => {
    it("Create New Product", async () => {
        const response = await productService.createNewProduct();
        expect(response.status).to.be.equal(201)

        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('name').that.is.a('string');
        expect(response.data).to.have.property('description').that.is.a('string');
        expect(response.data).to.have.property('price').that.is.a('number');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('stock').that.is.a('number');
        expect(response.data).to.have.property('variants').that.is.an('array');
        expect(response.data).to.have.property('tags').that.is.an('array');
        expect(response.data).to.have.property('status').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('id');
        expect(response.data.variants[0]).to.have.property('color').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('size').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('price').that.is.a('number');
        expect(response.data.variants[0]).to.have.property('stock').that.is.a('number');


    });

    it("Get All Products", async () => {
        const response = await productService.getAllProducts();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);

        expect(response.data).to.be.an("array");
        const firstData = response.data[0];

        expect(firstData).to.be.an("object");
        expect(firstData).to.have.property('id').that.is.a('number');
        expect(firstData).to.have.property('name').that.is.a('string');
        expect(firstData).to.have.property('description').that.is.a('string');
        expect(firstData).to.have.property('price').that.is.a('number');
        expect(firstData).to.have.property('categoryId').that.is.a('number');
        expect(firstData).to.have.property('stock').that.is.a('number');
        expect(firstData).to.have.property('variants').that.is.an('array');
        expect(firstData).to.have.property('tags').that.is.an('array');
        expect(firstData).to.have.property('status').that.is.a('string');
        expect(firstData.variants[0]).to.have.property('id');
        expect(firstData.variants[0]).to.have.property('color').that.is.a('string');
        expect(firstData.variants[0]).to.have.property('size').that.is.a('string');
        expect(firstData.variants[0]).to.have.property('price').that.is.a('number');
        expect(firstData.variants[0]).to.have.property('stock').that.is.a('number');
    });

    it("Get Product By ID", async () => {
        const response = await productService.getProductByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);

        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('name').that.is.a('string');
        expect(response.data).to.have.property('description').that.is.a('string');
        expect(response.data).to.have.property('price').that.is.a('number');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('stock').that.is.a('number');
        expect(response.data).to.have.property('variants').that.is.an('array');
        expect(response.data).to.have.property('tags').that.is.an('array');
        expect(response.data).to.have.property('status').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('id');
        expect(response.data.variants[0]).to.have.property('color').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('size').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('price').that.is.a('number');
        expect(response.data.variants[0]).to.have.property('stock').that.is.a('number');

    });

    it("Update Product By ID", async () => {
        const response = await productService.updateProductByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);

        expect(response).to.be.an("object");

        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('name').that.is.a('string');
        expect(response.data).to.have.property('description').that.is.a('string');
        expect(response.data).to.have.property('price').that.is.a('number');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('stock').that.is.a('number');
        expect(response.data).to.have.property('variants').that.is.an('array');
        expect(response.data).to.have.property('tags').that.is.an('array');
        expect(response.data).to.have.property('status').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('id');
        expect(response.data.variants[0]).to.have.property('color').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('size').that.is.a('string');
        expect(response.data.variants[0]).to.have.property('price').that.is.a('number');
        expect(response.data.variants[0]).to.have.property('stock').that.is.a('number');

    });

    it("Delete Product By ID", async () => {
        const response = await productService.deleteProductByID();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);

    });
})