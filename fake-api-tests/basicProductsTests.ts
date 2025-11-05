import { expect } from "chai"
import { productService } from "@/api/fakeApi/ProductsService";


describe("Products Test", async () => {
    it("Create New Product", async () => {
        const response = await productService.createNewProduct();
        expect(response).to.be.equal(201)
    });

    it("Get All Products", async () => {
        const response = await productService.getAllProducts();
        expect(response).to.be.an("array");

    });

    it("Get Product By ID", async () => {
        const response = await productService.getProductByID();
        expect(response).to.be.an("object");

    });

    it("Update Product By ID", async () => {
        const response = await productService.updateProductByID();
        expect(response).to.be.an("object");

    });

    it("Delete Product By ID", async () => {
        const response = await productService.deleteProductByID();
        expect(response).to.be.equal(200);

    });
})