import ApiService from '../ApiService';
import { buildRandomProductBody } from '@common/fakeApi/Utils';

class ProductService {
    private api = ApiService.getInstance().instance;

    public async createProduct(body?: any) {
        // POST /products
        const payload = body ?? buildRandomProductBody();
        return this.api.post('/products', payload);
    }

    public async getAllProducts() {
        // GET /products
        return this.api.get('/products');
    }

    public async getProductById(id: number) {
        // GET /products/{id}
        return this.api.get(`/products/${id}`);
    }

    public async updateProductById(id: number, body: any) {
        // PUT /products/{id}
        const payload = body ?? buildRandomProductBody();
        return this.api.put(`/products/${id}`, payload);
    }

    public async deleteProductById(id: number) {
        // DELETE /products/{id}
        return this.api.delete(`/products/${id}`);
    }
}

export const productService = new ProductService();