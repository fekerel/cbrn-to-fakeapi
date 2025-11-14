import { DeepPartial } from "@/common/fakeApi/Types";
import ApiService from "../ApiService";
import { randomPassword, buildRandomProductBody } from "@/common/fakeApi/Utils";
import { AxiosResponse } from "axios";
import { merge } from "lodash";
import addProductJSON from "@api/body/fakeApi/addProduct.json";

class ProductService {

    public async addProduct(productData: DeepPartial<typeof addProductJSON> = {}) {
        const overrides = productData;
        const body = merge({}, addProductJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/products", body);
        return res;
    }

    public async getAllProducts() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products`);
        return response;
    }

    public async getProductOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/products/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getRandomProduct() {
        const products = (await this.getAllProducts()).data;
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    }

    public async getProductByID() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}`);
        if (response.data.id !== product.id || response.status !== 200) {
            return false;
        }
        return response;
    }

    public async updateProduct() {
        const product = await this.getRandomProduct();
        if (!product || !product.id) {
            return false;
        }
        const newName = "UpdatedName" + randomPassword(5);
        const updateBody = {
            ...product,
            name: newName
        };
        const response = await ApiService.getInstance().instance.put(`/products/${product.id}`, updateBody);
        if (response.status !== 200)
            return false;
        const updatedProduct = await this.getProductOnlyByID(product.id);
        if (typeof updatedProduct !== "object") {
            return false;
        }
        if (updatedProduct.data.id === product.id && updatedProduct.data.name === newName)
            return updatedProduct;
        return false;
    }

    public async deleteProduct() {
        const product = await this.getRandomProduct();
        if (!product || !product.id) {
            return false;
        }
        const response = await ApiService.getInstance().instance.delete(`/products/${product.id}`);
        if (response.status !== 200)
            return false;
        const deletedProductList = (await this.getAllProducts()).data;
        const isFalse = deletedProductList.some((prod) => prod.id === product.id);
        if (isFalse)
            return false;
        return response
    }

    public async createNewProduct() {
        // Get a seller user
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No seller users found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];

        // Get a category
        const categoriesResponse = await ApiService.getInstance().instance.get("/categories");
        const categories = categoriesResponse.data;
        if (!categories || categories.length === 0) {
            throw new Error("No categories found");
        }
        const category = categories[Math.floor(Math.random() * categories.length)];

        const body = buildRandomProductBody({
            sellerId: seller.id,
            categoryId: category.id
        });

        const response = await ApiService.getInstance().instance.post("/products", JSON.parse(JSON.stringify(body)));
        if (response.status !== 201) {
            throw new Error(`Failed to create product. Status code: ${response.status}`);
        }
        return response
    }

    public async bulkUpdateProducts() {
        const products = (await this.getAllProducts()).data;
        if (!products || products.length === 0) {
            throw new Error("No products found");
        }
        const productIds = products.slice(0, Math.min(3, products.length)).map(p => p.id);
        const updates = productIds.map(id => ({
            productId: id,
            status: "active"
        }));
        const body = {
            updates: updates,
            operation: "update"
        };
        const response = await ApiService.getInstance().instance.post("/products/bulk-update", body);
        return response;
    }

    public async createProductBundle() {
        const products = (await this.getAllProducts()).data;
        if (!products || products.length < 2) {
            throw new Error("Not enough products found");
        }
        const selectedProducts = products.slice(0, 2);
        const body = {
            name: "Test Bundle",
            products: selectedProducts.map(p => ({ productId: p.id, quantity: 1 })),
            discount: 10
        };
        const response = await ApiService.getInstance().instance.post("/products/create-bundle", body);
        return response;
    }

    public async getProductBundleRecommendations() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/bundle-recommendations`);
        return response;
    }

    public async searchProducts() {
        const response = await ApiService.getInstance().instance.get("/products/search?q=test");
        return response;
    }

    public async searchProductsPost() {
        const body = {
            name: "test"
        };
        const response = await ApiService.getInstance().instance.post("/products/search", body);
        return response;
    }

    public async getProductCrossSell() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/cross-sell`);
        return response;
    }

    public async getProductDemandAnalysis() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/demand-analysis`);
        return response;
    }

    public async getLowStockProducts() {
        const response = await ApiService.getInstance().instance.get("/products/low-stock");
        return response;
    }

    public async getProductPopularityScore() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/popularity-score`);
        return response;
    }

    public async getProductPriceTrend() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/price-trend`);
        return response;
    }

    public async getProductReviewSalesCorrelation() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/review-sales-correlation`);
        return response;
    }

    public async getProductReviewsSummary() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/reviews-summary`);
        return response;
    }

    public async getProductSalesForecast() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/sales-forecast`);
        return response;
    }

    public async getProductRecommendations() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/recommendations`);
        return response;
    }

    public async getProductSalesStats() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/sales-stats`);
        return response;
    }

    public async getProductStockMovement() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/stock-movement`);
        return response;
    }

    public async getProductVariantsSummary() {
        const product = await this.getRandomProduct();
        const response = await ApiService.getInstance().instance.get(`/products/${product.id}/variants-summary`);
        return response;
    }

    public async getTopReviewedProducts() {
        const response = await ApiService.getInstance().instance.get("/products/top-reviewed");
        return response;
    }
}

export const productService = new ProductService();

