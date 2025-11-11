import ApiService from '../ApiService';

class ProductService {
    // CRUD stubs only for experiment.

    public async createProduct(body?: any) {
        // AI: POST /products
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getAllProducts() {
        // AI: GET /products
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getProductById(id: number) {
        // AI: GET /products/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async updateProductById(id: number, body: any) {
        // AI: PUT /products/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async deleteProductById(id: number) {
        // AI: DELETE /products/{id}
        throw new Error("NOT_IMPLEMENTED");
    }
}

export const productService = new ProductService();