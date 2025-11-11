import ApiService from "../ApiService";
import { AxiosResponse } from "axios";
import { productService } from "./ProductsService";
import { categoryService } from "./CategoryService";
import { userService } from "./UserService";
import { orderService } from "./OrderService";
import { reviewService } from "./ReviewService";

class SpecialEndpointService {

    // 1. Product Sales Stats
    public async getProductSalesStatsOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductSalesStatsByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 2. Category Products Summary
    public async getCategoryProductsSummaryOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/products-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategoryProductsSummaryByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/products-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 3. User Order History
    public async getUserOrderHistoryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/order-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserOrderHistoryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/order-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 4. Seller Dashboard
    public async getSellerDashboardOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/dashboard`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response;
    }

    public async getSellerDashboardByID() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${randomSeller.id}/dashboard`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== randomSeller.id)
            return false;
        return response;
    }

    // 5. Category Subcategories
    public async getCategorySubcategoriesOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/subcategories`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategorySubcategoriesByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/subcategories`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 6. Order Details
    public async getOrderDetailsOnlyByID(orderId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${orderId}/details`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.orderId !== orderId)
            return false;
        return response;
    }

    public async getOrderDetailsByID() {
        const order = await orderService.randomOrder();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/${order.id}/details`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.orderId !== order.id)
            return false;
        return response;
    }

    // 7. Product Variants Summary
    public async getProductVariantsSummaryOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/variants-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductVariantsSummaryByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/variants-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 8. User Purchase Summary
    public async getUserPurchaseSummaryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/purchase-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserPurchaseSummaryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/purchase-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 9. Category Sales Stats
    public async getCategorySalesStatsOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategorySalesStatsByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/sales-stats`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 10. Recent Orders
    public async getRecentOrders(limit?: number, offset?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        if (offset !== undefined) params.offset = offset;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/recent`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
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
        return response;
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
        return response;
    }

    // 12. User Activity
    public async getUserActivityOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/activity`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserActivityByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/activity`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 13. Order Statistics
    public async getOrderStatistics() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/statistics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
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
        return response;
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
        return response;
    }

    // 15. Seller Analytics
    public async getSellerAnalyticsOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/analytics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response;
    }

    public async getSellerAnalyticsByID() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${randomSeller.id}/analytics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== randomSeller.id)
            return false;
        return response;
    }

    // 16. Product Reviews Summary
    public async getProductReviewsSummaryOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/reviews-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductReviewsSummaryByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/reviews-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 17. User Reviews History
    public async getUserReviewsHistoryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/reviews-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserReviewsHistoryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/reviews-history`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 18. Top Reviewed Products
    public async getTopReviewedProducts(limit?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/top-reviewed`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 19. Category Reviews Statistics
    public async getCategoryReviewsStatisticsOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/reviews-statistics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategoryReviewsStatisticsByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/reviews-statistics`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 20. Product Review and Sales Correlation
    public async getProductReviewSalesCorrelationOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/review-sales-correlation`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductReviewSalesCorrelationByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/review-sales-correlation`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 21. User Order Timeline
    public async getUserOrderTimelineOnlyByID(userId: number, period?: string) {
        const params: any = {};
        if (period !== undefined) params.period = period;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/order-timeline`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserOrderTimelineByID(period?: string) {
        const user = await userService.getRandomUser();
        const params: any = {};
        if (period !== undefined) params.period = period;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/order-timeline`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 22. Product Inventory Alert
    public async getProductInventoryAlert(threshold?: number, categoryId?: number) {
        const params: any = {};
        if (threshold !== undefined) params.threshold = threshold;
        if (categoryId !== undefined) params.categoryId = categoryId;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/low-stock`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 23. Category Performance Comparison
    public async getCategoryPerformanceComparison(limit?: number, sortBy?: string) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        if (sortBy !== undefined) params.sortBy = sortBy;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/performance-comparison`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 24. Seller Performance Ranking
    public async getSellerPerformanceRanking(limit?: number, sortBy?: string) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        if (sortBy !== undefined) params.sortBy = sortBy;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/ranking`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 25. User Lifetime Value
    public async getUserLifetimeValueOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/lifetime-value`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserLifetimeValueByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/lifetime-value`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 26. Product Cross-Sell Opportunities
    public async getProductCrossSellOnlyByID(productId: number, limit?: number) {
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/cross-sell`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductCrossSellByID(limit?: number) {
        const product = await productService.randomProduct();
        const params: any = {};
        if (limit !== undefined) params.limit = limit;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/cross-sell`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 27. Order Fulfillment Status
    public async getOrderFulfillmentStatus(userId?: number, sellerId?: number, categoryId?: number) {
        const params: any = {};
        if (userId !== undefined) params.userId = userId;
        if (sellerId !== undefined) params.sellerId = sellerId;
        if (categoryId !== undefined) params.categoryId = categoryId;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/fulfillment-status`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 28. User Payment Methods Summary
    public async getUserPaymentMethodsSummaryOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/payment-methods-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserPaymentMethodsSummaryByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/payment-methods-summary`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 29. Product Price Trend
    public async getProductPriceTrendOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/price-trend`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductPriceTrendByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/price-trend`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 30. Seller Product Portfolio
    public async getSellerProductPortfolioOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/product-portfolio`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response;
    }

    public async getSellerProductPortfolioByID() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${randomSeller.id}/product-portfolio`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== randomSeller.id)
            return false;
        return response;
    }

    // 31. Category Revenue Trend
    public async getCategoryRevenueTrendOnlyByID(categoryId: number) {
        const period = 'monthly';
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/revenue-trend`, {
            params: { period }
        });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategoryRevenueTrendByID() {
        const category = await categoryService.getRandomCategory();
        const period = 'monthly';
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/revenue-trend`, {
            params: { period }
        });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 32. User Shopping Patterns
    public async getUserShoppingPatternsOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/shopping-patterns`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserShoppingPatternsByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/shopping-patterns`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 33. Product Stock Movement
    public async getProductStockMovementOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/stock-movement`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductStockMovementByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/stock-movement`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 34. Order Cancellation Analysis
    public async getOrderCancellationAnalysis() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/cancellation-analysis`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 35. User Engagement Score
    public async getUserEngagementScoreOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/engagement-score`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserEngagementScoreByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/engagement-score`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }


    // 36. Product Popularity Score
    public async getProductPopularityScoreOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/popularity-score`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductPopularityScoreByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/popularity-score`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 37. Category Market Share
    public async getCategoryMarketShareOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/market-share`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategoryMarketShareByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/market-share`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 38. Seller Customer Retention
    public async getSellerCustomerRetentionOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/customer-retention`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response;
    }

    public async getSellerCustomerRetentionByID() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${randomSeller.id}/customer-retention`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== randomSeller.id)
            return false;
        return response;
    }

    // 39. User Return Rate
    public async getUserReturnRateOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/return-rate`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserReturnRateByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/return-rate`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 40. Product Bundle Recommendations
    public async getProductBundleRecommendationsOnlyByID(productId: number) {
        const limit = 5;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/bundle-recommendations`, {
            params: { limit }
        });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductBundleRecommendationsByID() {
        const product = await productService.randomProduct();
        const limit = 5;
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/bundle-recommendations`, {
            params: { limit }
        });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // 41. User-Seller Combined Analytics
    public async getUserSellerAnalytics(userId?: number, sellerId?: number) {
        const params: any = {};

        if (userId !== undefined) {
            params.userId = userId;
        }
        if (sellerId !== undefined) {
            params.sellerId = sellerId;
        }

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/analytics/user-seller`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    public async getUserSellerAnalyticsNoParams() {
        return this.getUserSellerAnalytics();
    }

    public async getUserSellerAnalyticsUserIdOnly() {
        const user = await userService.getRandomUser();
        return this.getUserSellerAnalytics(user.id);
    }

    public async getUserSellerAnalyticsSellerIdOnly() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        return this.getUserSellerAnalytics(undefined, randomSeller.id);
    }

    public async getUserSellerAnalyticsBoth() {
        const user1 = await userService.getRandomUser();
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        return this.getUserSellerAnalytics(user1.id, randomSeller.id);
    }

    // 42. Product-Category Search
    public async getProductCategorySearch(productId?: number, categoryId?: number, status?: string, minPrice?: number, maxPrice?: number) {
        const params: any = {};

        if (productId !== undefined) params.productId = productId;
        if (categoryId !== undefined) params.categoryId = categoryId;
        if (status !== undefined) params.status = status;
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/search`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    public async getProductCategorySearchNoParams() {
        return this.getProductCategorySearch();
    }

    public async getProductCategorySearchProductIdOnly() {
        const product = await productService.randomProduct();
        return this.getProductCategorySearch(product.id);
    }

    public async getProductCategorySearchCategoryIdOnly() {
        const category = await categoryService.getRandomCategory();
        return this.getProductCategorySearch(undefined, category.id);
    }

    public async getProductCategorySearchStatusOnly() {
        const status = ['active', 'inactive'][Math.floor(Math.random() * 2)];
        return this.getProductCategorySearch(undefined, undefined, status);
    }

    public async getProductCategorySearchCategoryIdAndStatus() {
        const category = await categoryService.getRandomCategory();
        const status = ['active', 'inactive'][Math.floor(Math.random() * 2)];
        return this.getProductCategorySearch(undefined, category.id, status);
    }

    // 43. Order Filter Analysis
    public async getOrderFilterAnalysis(orderId?: number, userId?: number, status?: string, startDate?: number, endDate?: number) {
        const params: any = {};

        if (orderId !== undefined) params.orderId = orderId;
        if (userId !== undefined) params.userId = userId;
        if (status !== undefined) params.status = status;
        if (startDate !== undefined) params.startDate = startDate;
        if (endDate !== undefined) params.endDate = endDate;

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/orders/filter`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    public async getOrderFilterAnalysisNoParams() {
        return this.getOrderFilterAnalysis();
    }

    public async getOrderFilterAnalysisOrderIdOnly() {
        const order = await orderService.randomOrder();
        return this.getOrderFilterAnalysis(order.id);
    }

    public async getOrderFilterAnalysisUserIdOnly() {
        const user = await userService.getRandomUser();
        return this.getOrderFilterAnalysis(undefined, user.id);
    }

    public async getOrderFilterAnalysisUserIdAndStatus() {
        const user = await userService.getRandomUser();
        const status = ['delivered', 'cancelled', 'returned', 'failed', 'pending', 'processing', 'shipped'][Math.floor(Math.random() * 7)];
        return this.getOrderFilterAnalysis(undefined, user.id, status);
    }

    // 44. Review-Product Analysis
    public async getReviewProductAnalysis(reviewId?: number, productId?: number, userId?: number, rating?: number) {
        const params: any = {};

        if (reviewId !== undefined) params.reviewId = reviewId;
        if (productId !== undefined) params.productId = productId;
        if (userId !== undefined) params.userId = userId;
        if (rating !== undefined) params.rating = rating;

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/reviews/analysis`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    public async getReviewProductAnalysisNoParams() {
        return this.getReviewProductAnalysis();
    }

    public async getReviewProductAnalysisProductIdOnly() {
        const product = await productService.randomProduct();
        return this.getReviewProductAnalysis(undefined, product.id);
    }

    public async getReviewProductAnalysisProductIdAndRating() {
        const product = await productService.randomProduct();
        const rating = Math.floor(Math.random() * 5) + 1;
        return this.getReviewProductAnalysis(undefined, product.id, undefined, rating);
    }

    // 45. Category-Product Statistics
    public async getCategoryProductStatistics(categoryId?: number, status?: string, includeProducts?: boolean, includeSales?: boolean) {
        const params: any = {};

        if (categoryId !== undefined) params.categoryId = categoryId;
        if (status !== undefined) params.status = status;
        if (includeProducts !== undefined) params.includeProducts = includeProducts.toString();
        if (includeSales !== undefined) params.includeSales = includeSales.toString();

        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/statistics/category-product`, { params });
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    public async getCategoryProductStatisticsNoParams() {
        return this.getCategoryProductStatistics();
    }

    public async getCategoryProductStatisticsCategoryIdOnly() {
        const category = await categoryService.getRandomCategory();
        return this.getCategoryProductStatistics(category.id);
    }

    public async getCategoryProductStatisticsCategoryIdWithProducts() {
        const category = await categoryService.getRandomCategory();
        return this.getCategoryProductStatistics(category.id, undefined, true);
    }

    public async getCategoryProductStatisticsCategoryIdWithSales() {
        const category = await categoryService.getRandomCategory();
        return this.getCategoryProductStatistics(category.id, undefined, false, true);
    }

    public async getCategoryProductStatisticsCategoryIdFull() {
        const category = await categoryService.getRandomCategory();
        return this.getCategoryProductStatistics(category.id, undefined, true, true);
    }



    // 46. Product Sales Forecast
    public async getProductSalesForecastOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/sales-forecast`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductSalesForecastByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/sales-forecast`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }

    // 47. User Churn Analysis
    public async getUserChurnAnalysisOnlyByID(userId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${userId}/churn-analysis`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== userId)
            return false;
        return response;
    }

    public async getUserChurnAnalysisByID() {
        const user = await userService.getRandomUser();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users/${user.id}/churn-analysis`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.userId !== user.id)
            return false;
        return response;
    }

    // 48. Category Growth Rate
    public async getCategoryGrowthRateOnlyByID(categoryId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${categoryId}/growth-rate`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== categoryId)
            return false;
        return response;
    }

    public async getCategoryGrowthRateByID() {
        const category = await categoryService.getRandomCategory();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories/${category.id}/growth-rate`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.categoryId !== category.id)
            return false;
        return response;
    }

    // 49. Seller Revenue Forecast
    public async getSellerRevenueForecastOnlyByID(sellerId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${sellerId}/revenue-forecast`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== sellerId)
            return false;
        return response;
    }

    public async getSellerRevenueForecastByID() {
        const allUsers = (await userService.getAllUsers()).data;
        const sellers = allUsers.filter(u => u.role === 'seller');
        if (sellers.length === 0) {
            return false;
        }
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/sellers/${randomSeller.id}/revenue-forecast`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.sellerId !== randomSeller.id)
            return false;
        return response;
    }

    // 50. Product Demand Analysis
    public async getProductDemandAnalysisOnlyByID(productId: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${productId}/demand-analysis`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== productId)
            return false;
        return response;
    }

    public async getProductDemandAnalysisByID() {
        const product = await productService.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}/demand-analysis`);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        if (response.data.productId !== product.id)
            return false;
        return response;
    }






    // 51. User Search
    public async searchUsers() {
        const allUsers = (await userService.getAllUsers()).data;
        if (allUsers.length === 0) {
            return false;
        }

        // Random field selection
        const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
        const randomChoice = Math.floor(Math.random() * 4); // 0-3

        let body: any = {};

        if (randomChoice === 0) {
            // Only email (unique - returns object)
            body = { email: randomUser.email };
        } else if (randomChoice === 1) {
            // Only firstName (returns array)
            body = { firstName: randomUser.firstName };
        } else if (randomChoice === 2) {
            // Only lastName (returns array)
            body = { lastName: randomUser.lastName };
        } else {
            // Multiple fields
            const includeEmail = Math.random() > 0.5;
            const includeFirstName = Math.random() > 0.5;
            const includeLastName = Math.random() > 0.5;

            if (includeEmail) body.email = randomUser.email;
            if (includeFirstName) body.firstName = randomUser.firstName;
            if (includeLastName) body.lastName = randomUser.lastName;

            // Ensure at least one field
            if (Object.keys(body).length === 0) {
                body.firstName = randomUser.firstName;
            }
        }

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/users/search`, JSON.parse(JSON.stringify(body)));
        if (response.status !== 200 || (typeof response.data !== "object" && !Array.isArray(response.data)))
            return false;
        return response;
    }

    // 52. Product Search
    public async searchProducts() {
        const allProducts = (await productService.getAllProducts()).data;
        if (allProducts.length === 0) {
            return false;
        }

        const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
        const randomChoice = Math.floor(Math.random() * 4); // 0-3

        let body: any = {};

        if (randomChoice === 0) {
            // Only productId (unique - returns object)
            body = { productId: randomProduct.id };
        } else if (randomChoice === 1) {
            // Only name (returns array)
            body = { name: randomProduct.name };
        } else if (randomChoice === 2) {
            // Only categoryId (returns array)
            body = { categoryId: randomProduct.categoryId };
        } else {
            // Multiple fields with random nulls
            const includeProductId = Math.random() > 0.5 ? randomProduct.id : null;
            const includeName = Math.random() > 0.5 ? randomProduct.name : null;
            const includeCategoryId = Math.random() > 0.5 ? randomProduct.categoryId : null;

            if (includeProductId !== null) body.productId = includeProductId;
            if (includeName !== null) body.name = includeName;
            if (includeCategoryId !== null) body.categoryId = includeCategoryId;

            // Ensure at least one field
            if (Object.keys(body).length === 0) {
                body.name = randomProduct.name;
            }
        }

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/products/search`, JSON.parse(JSON.stringify(body)));
        if (response.status !== 200 || (typeof response.data !== "object" && !Array.isArray(response.data)))
            return false;
        return response;
    }

    // 53. Order Search
    public async searchOrders() {
        const allOrders = (await orderService.getAllOrders()).data;
        if (allOrders.length === 0) {
            return false;
        }

        const randomOrder = allOrders[Math.floor(Math.random() * allOrders.length)];
        const randomChoice = Math.floor(Math.random() * 4); // 0-3

        let body: any = {};

        if (randomChoice === 0) {
            // Only orderId (unique - returns object)
            body = { orderId: randomOrder.id };
        } else if (randomChoice === 1) {
            // Only userId (returns array)
            body = { userId: randomOrder.userId };
        } else if (randomChoice === 2) {
            // Only status (returns array)
            body = { status: randomOrder.status };
        } else {
            // Multiple fields with random nulls
            const includeOrderId = Math.random() > 0.5 ? randomOrder.id : null;
            const includeUserId = Math.random() > 0.5 ? randomOrder.userId : null;
            const includeStatus = Math.random() > 0.5 ? randomOrder.status : null;

            if (includeOrderId !== null) body.orderId = includeOrderId;
            if (includeUserId !== null) body.userId = includeUserId;
            if (includeStatus !== null) body.status = includeStatus;

            // Ensure at least one field
            if (Object.keys(body).length === 0) {
                body.userId = randomOrder.userId;
            }
        }

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/orders/search`, JSON.parse(JSON.stringify(body)));
        if (response.status !== 200 || (typeof response.data !== "object" && !Array.isArray(response.data)))
            return false;
        return response;
    }

    // 54. Review Search
    public async searchReviews() {
        const allReviews = (await reviewService.getAllReviews()).data;
        if (allReviews.length === 0) {
            return false;
        }

        const randomReview = allReviews[Math.floor(Math.random() * allReviews.length)];
        const randomChoice = Math.floor(Math.random() * 5); // 0-4

        let body: any = {};

        if (randomChoice === 0) {
            // Only reviewId (unique - returns object)
            body = { reviewId: randomReview.id };
        } else if (randomChoice === 1) {
            // Only productId (returns array)
            body = { productId: randomReview.productId };
        } else if (randomChoice === 2) {
            // Only userId (returns array)
            body = { userId: randomReview.userId };
        } else if (randomChoice === 3) {
            // Only rating (returns array)
            body = { rating: randomReview.rating };
        } else {
            // Multiple fields with random nulls
            const includeReviewId = Math.random() > 0.5 ? randomReview.id : null;
            const includeProductId = Math.random() > 0.5 ? randomReview.productId : null;
            const includeUserId = Math.random() > 0.5 ? randomReview.userId : null;
            const includeRating = Math.random() > 0.5 ? randomReview.rating : null;

            if (includeReviewId !== null) body.reviewId = includeReviewId;
            if (includeProductId !== null) body.productId = includeProductId;
            if (includeUserId !== null) body.userId = includeUserId;
            if (includeRating !== null) body.rating = includeRating;

            // Ensure at least one field
            if (Object.keys(body).length === 0) {
                body.productId = randomReview.productId;
            }
        }


        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/reviews/search`, JSON.parse(JSON.stringify(body)));
        if (response.status !== 200 || (typeof response.data !== "object" && !Array.isArray(response.data)))
            return false;
        return response;
    }

    // 55. Category Search
    public async searchCategories() {
        const allCategories = (await categoryService.getAllCategories()).data;
        if (allCategories.length === 0) {
            return false;
        }

        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        const randomChoice = Math.floor(Math.random() * 4); // 0-3

        let body: any = {};

        if (randomChoice === 0) {
            // Only categoryId (unique - returns object)
            body = { categoryId: randomCategory.id };
        } else if (randomChoice === 1) {
            // Only name (returns array)
            body = { name: randomCategory.name };
        } else if (randomChoice === 2) {
            // Only status (returns array)
            body = { status: randomCategory.status };
        } else {
            // Multiple fields with random nulls
            const includeCategoryId = Math.random() > 0.5 ? randomCategory.id : null;
            const includeName = Math.random() > 0.5 ? randomCategory.name : null;
            const includeStatus = Math.random() > 0.5 ? randomCategory.status : null;

            if (includeCategoryId !== null) body.categoryId = includeCategoryId;
            if (includeName !== null) body.name = includeName;
            if (includeStatus !== null) body.status = includeStatus;

            // Ensure at least one field
            if (Object.keys(body).length === 0) {
                body.name = randomCategory.name;
            }
        }

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/categories/search`, JSON.parse(JSON.stringify(body)));
        if (response.status !== 200 || (typeof response.data !== "object" && !Array.isArray(response.data)))
            return false;
        return response;
    }








    // 56. Order Creation with Validation
    public async createOrderWithValidation() {
        const user = await userService.getRandomUser();
        const allProducts = (await productService.getAllProducts()).data;

        if (allProducts.length === 0) {
            return false;
        }

        // Random number of items (1-3)
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        const selectedProductIds = new Set();

        for (let i = 0; i < itemCount; i++) {
            let product;
            let attempts = 0;
            do {
                product = allProducts[Math.floor(Math.random() * allProducts.length)];
                attempts++;
            } while (selectedProductIds.has(product.id) && attempts < 10);

            selectedProductIds.add(product.id);
            const quantity = Math.floor(Math.random() * 3) + 1;
            items.push({
                productId: product.id,
                quantity: quantity
            });
        }

        // Random optional fields
        const body: any = {
            userId: user.id,
            items: items
        };

        if (Math.random() > 0.5) {
            body.shippingAddress = `Address ${Math.floor(Math.random() * 1000)}`;
        }

        if (Math.random() > 0.5) {
            const paymentMethods = ['credit_card', 'paypal', 'bank_transfer'];
            body.paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        }

        const bodyString = JSON.stringify(body);
        const parsedBody = JSON.parse(bodyString);



        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/orders/create`, parsedBody);
        if (response.status !== 201 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 57. Bulk Product Inventory Update
    public async bulkUpdateProducts() {
        const allProducts = (await productService.getAllProducts()).data;

        if (allProducts.length === 0) {
            return false;
        }

        // Random number of products to update (1-3)
        const updateCount = Math.floor(Math.random() * 3) + 1;
        const updates = [];
        const selectedProductIds = new Set();

        for (let i = 0; i < updateCount; i++) {
            let product;
            let attempts = 0;
            do {
                product = allProducts[Math.floor(Math.random() * allProducts.length)];
                attempts++;
            } while (selectedProductIds.has(product.id) && attempts < 10);

            selectedProductIds.add(product.id);

            const update: any = {
                productId: product.id
            };

            // Random field selection
            if (Math.random() > 0.5) {
                update.stock = Math.floor(Math.random() * 200) + 10;
            }

            if (Math.random() > 0.5) {
                update.price = Number((Math.random() * 100 + 10).toFixed(2));
            }

            if (Math.random() > 0.5) {
                const statuses = ['active', 'inactive', 'out_of_stock'];
                update.status = statuses[Math.floor(Math.random() * statuses.length)];
            }

            if (Math.random() > 0.5) {
                update.discount = Math.floor(Math.random() * 30) + 5;
            }

            updates.push(update);
        }

        const body: any = {
            updates: updates
        };

        if (Math.random() > 0.5) {
            const operations = ['update', 'add', 'subtract'];
            body.operation = operations[Math.floor(Math.random() * operations.length)];
        }

        const bodyString = JSON.stringify(body);
        const parsedBody = JSON.parse(bodyString);


        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/products/bulk-update`, parsedBody);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 58. User Purchase Analysis
    public async getUserPurchaseAnalysis() {
        const user = await userService.getRandomUser();
        const allCategories = (await categoryService.getAllCategories()).data;
        const allProducts = (await productService.getAllProducts()).data;

        const body: any = {
            userId: user.id
        };

        // Random filter selection
        if (Math.random() > 0.5) {
            const daysAgo = Math.floor(Math.random() * 90) + 30;
            body.startDate = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
        }

        if (Math.random() > 0.5) {
            body.endDate = Date.now();
        }

        if (Math.random() > 0.5) {
            body.minAmount = Number((Math.random() * 50 + 10).toFixed(2));
        }

        if (Math.random() > 0.5) {
            body.maxAmount = Number((Math.random() * 500 + 100).toFixed(2));
        }

        if (Math.random() > 0.5 && allCategories.length > 0) {
            const categoryCount = Math.floor(Math.random() * Math.min(3, allCategories.length)) + 1;
            body.categoryIds = [];
            for (let i = 0; i < categoryCount; i++) {
                const category = allCategories[Math.floor(Math.random() * allCategories.length)];
                if (!body.categoryIds.includes(category.id)) {
                    body.categoryIds.push(category.id);
                }
            }
        }

        if (Math.random() > 0.5 && allProducts.length > 0) {
            const productCount = Math.floor(Math.random() * Math.min(3, allProducts.length)) + 1;
            body.productIds = [];
            for (let i = 0; i < productCount; i++) {
                const product = allProducts[Math.floor(Math.random() * allProducts.length)];
                if (!body.productIds.includes(product.id)) {
                    body.productIds.push(product.id);
                }
            }
        }

        if (Math.random() > 0.5) {
            const statuses = ['pending', 'completed', 'shipped', 'cancelled'];
            body.status = statuses[Math.floor(Math.random() * statuses.length)];
        }

        const bodyString = JSON.stringify(body);
        const parsedBody = JSON.parse(bodyString);


        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/users/purchase-analysis`, parsedBody);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 59. Product Bundle Creation
    public async createProductBundle() {
        const allProducts = (await productService.getAllProducts()).data;

        if (allProducts.length < 2) {
            return false;
        }

        // Random number of products in bundle (2-4)
        const productCount = Math.floor(Math.random() * 3) + 2;
        const products = [];
        const selectedProductIds = new Set();

        for (let i = 0; i < productCount; i++) {
            let product;
            let attempts = 0;
            do {
                product = allProducts[Math.floor(Math.random() * allProducts.length)];
                attempts++;
            } while (selectedProductIds.has(product.id) && attempts < 10);

            selectedProductIds.add(product.id);
            const quantity = Math.floor(Math.random() * 2) + 1;
            products.push({
                productId: product.id,
                quantity: quantity
            });
        }

        const body: any = {
            name: `Bundle ${Math.floor(Math.random() * 1000)}`,
            products: products
        };

        if (Math.random() > 0.5) {
            body.description = `Custom bundle description ${Math.floor(Math.random() * 100)}`;
        }

        // Either discount or bundlePrice, not both
        if (Math.random() > 0.5) {
            body.discount = Math.floor(Math.random() * 30) + 10;
        } else {
            body.bundlePrice = Number((Math.random() * 200 + 50).toFixed(2));
        }

        if (Math.random() > 0.5) {
            const statuses = ['active', 'inactive'];
            body.status = statuses[Math.floor(Math.random() * statuses.length)];
        }

        const bodyString = JSON.stringify(body);
        const parsedBody = JSON.parse(bodyString);

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/products/create-bundle`, parsedBody);
        if (response.status !== 201 || typeof response.data !== "object")
            return false;
        return response;
    }

    // 60. Order Fulfillment Processing
    public async fulfillOrder() {
        const allOrders = (await orderService.getAllOrders()).data;
        const allProducts = (await productService.getAllProducts()).data;

        if (allOrders.length === 0) {
            return false;
        }

        // Helper function to check if all products in order exist
        const hasValidProducts = (order: any) => {
            if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
                return false;
            }
            const productIdSet = new Set(allProducts.map(p => Number(p.id)));
            return order.items.every((item: any) => {
                const productId = Number(item.productId);
                return productIdSet.has(productId);
            });
        };

        // Find an order that's not completed or shipped and has valid products
        let order = allOrders.find(o =>
            o.status !== 'completed' &&
            o.status !== 'shipped' &&
            hasValidProducts(o)
        );

        if (!order) {
            // If no pending order with valid products, try to find any order with valid products
            order = allOrders.find(o => hasValidProducts(o));
        }

        if (!order) {
            // If still no valid order, return false
            return false;
        }

        const body: any = {
            orderId: order.id
        };

        // Random field selection
        if (Math.random() > 0.5) {
            const paymentStatuses = ['pending', 'paid', 'refunded'];
            body.paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
        }

        if (Math.random() > 0.5) {
            const shippingMethods = ['standard', 'express', 'overnight'];
            body.shippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)];
        }

        if (Math.random() > 0.5) {
            body.trackingNumber = `TRACK${Math.floor(Math.random() * 1000000)}`;
        }

        if (Math.random() > 0.5) {
            body.autoUpdateStock = Math.random() > 0.5;
        }

        const bodyString = JSON.stringify(body);
        const parsedBody = JSON.parse(bodyString);

        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/orders/fulfill`, parsedBody);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        return response;
    }

}

export const specialEndpointService = new SpecialEndpointService();

