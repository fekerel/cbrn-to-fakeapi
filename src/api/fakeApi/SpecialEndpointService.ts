import ApiService from "../ApiService";
import { AxiosResponse } from "axios";
import { productService } from "./ProductsService";
import { categoryService } from "./CategoryService";
import { userService } from "./UserService";
import { orderService } from "./OrderService";

class SpecialEndpointService {

    // 1. Product Sales Stats
    public async getProductSalesStatsOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response.data;
    }

    public async getProductSalesStatsByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response.data;
    }

    // 2. Category Products Summary
    public async getCategoryProductsSummaryOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/products-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response.data;
    }

    public async getCategoryProductsSummaryByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/products-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response.data;
    }

    // 3. User Order History
    public async getUserOrderHistoryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/order-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response.data;
    }

    public async getUserOrderHistoryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/order-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response.data;
    }

    // 4. Seller Dashboard
    public async getSellerDashboardOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/dashboard`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response.data;
    }

    public async getSellerDashboardByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${user.id}/dashboard`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== user.id)
            return false;
        return response.data;
    }

    // 5. Category Subcategories
    public async getCategorySubcategoriesOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/subcategories`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response.data;
    }

    public async getCategorySubcategoriesByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/subcategories`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response.data;
    }

    // 6. Order Details
    public async getOrderDetailsOnlyByID(orderId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${orderId}/details`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.orderId !== orderId)
            return false;
        return response.data;
    }

    public async getOrderDetailsByID() {
        const order = await orderService.randomOrder();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${order.id}/details`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.orderId !== order.id)
            return false;
        return response.data;
    }

    // 7. Product Variants Summary
    public async getProductVariantsSummaryOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/variants-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response.data;
    }

    public async getProductVariantsSummaryByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/variants-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response.data;
    }

    // 8. User Purchase Summary
    public async getUserPurchaseSummaryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/purchase-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response.data;
    }

    public async getUserPurchaseSummaryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/purchase-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response.data;
    }

    // 9. Category Sales Stats
    public async getCategorySalesStatsOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response.data;
    }

    public async getCategorySalesStatsByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response.data;
    }

    // 10. Recent Orders
    public async getRecentOrders(limit?: number, offset?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        if (offset !== undefined) params.offset = offset;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/recent`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response.data;
    }

    // 11. Product Recommendations
    public async getProductRecommendationsOnlyByID(productId: number, limit?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/recommendations`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response.data;
    }

    public async getProductRecommendationsByID(limit?: number) {
        const product = await productService.randomProduct();
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/recommendations`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response.data;
    }

    // 12. User Activity
    public async getUserActivityOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/activity`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response.data;
    }

    public async getUserActivityByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/activity`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response.data;
    }

    // 13. Order Statistics
    public async getOrderStatistics() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/statistics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response.data;
    }

    // 14. Category Trending Products
    public async getCategoryTrendingProductsOnlyByID(categoryId: number, limit?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/trending-products`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response.data;
    }

    public async getCategoryTrendingProductsByID(limit?: number) {
        const category = await categoryService.getRandomCategory();
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/trending-products`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response.data;
    }

    // 15. Seller Analytics
    public async getSellerAnalyticsOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/analytics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response.data;
    }

    public async getSellerAnalyticsByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${user.id}/analytics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== user.id)
            return false;
        return response.data;
    }
}

export const specialEndpointService = new SpecialEndpointService();

