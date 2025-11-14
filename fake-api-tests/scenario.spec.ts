import { expect } from "chai";
import { productService } from "../src/api/fakeApi/ProductService";
import { categoryService } from "../src/api/fakeApi/CategoryService";
import { orderService } from "../src/api/fakeApi/OrderService";
import { reviewService } from "../src/api/fakeApi/ReviewService";
import { userService } from "../src/api/fakeApi/UserService";
import { sellerService } from "../src/api/fakeApi/SellerService";
import { analyticsService } from "../src/api/fakeApi/AnalyticsService";


describe("Scenario endpoints (fakeapi)", function () {
    this.timeout(20000);

    it("POST /products/bulk-update - updates multiple products (200)", async () => {
        const response = await productService.bulkUpdateProducts();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('success').that.is.a('boolean');
        expect(response.data).to.have.property('operation').that.is.a('string');
        expect(response.data).to.have.property('totalProcessed').that.is.a('number');
        expect(response.data).to.have.property('successful').that.is.a('number');
        expect(response.data).to.have.property('failed').that.is.a('number');
        expect(response.data).to.have.property('results').that.is.an('array');
        if (response.data.errors !== undefined) {
            expect(response.data.errors).to.be.an('array');
        }
        if (response.data.warnings !== undefined) {
            expect(response.data.warnings).to.be.an('array');
        }
    })

    it("GET /categories/{id}/products-summary - returns category products summary (200)", async () => {
        const response = await categoryService.getCategoryProductsSummary();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('activeProducts').that.is.a('number');
        expect(response.data).to.have.property('totalStock').that.is.a('number');
        expect(response.data).to.have.property('averagePrice').that.is.a('number');
        expect(response.data).to.have.property('priceRange').that.is.an('object');
        if (response.data.priceRange) {
            expect(response.data.priceRange).to.have.property('min').that.is.a('number');
            expect(response.data.priceRange).to.have.property('max').that.is.a('number');
        }
    })

    it("GET /categories/{id}/sales-stats - returns category sales statistics (200)", async () => {
        const response = await categoryService.getCategorySalesStats();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('totalSales').that.is.a('number');
        expect(response.data).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data).to.have.property('averageOrderValue').that.is.a('number');
        expect(response.data).to.have.property('topSellingProducts').that.is.an('array');
        if (response.data.topSellingProducts && response.data.topSellingProducts.length > 0) {
            const product = response.data.topSellingProducts[0];
            expect(product).to.have.property('productId').that.is.a('number');
            expect(product).to.have.property('productName').that.is.a('string');
            expect(product).to.have.property('salesCount').that.is.a('number');
            expect(product).to.have.property('revenue').that.is.a('number');
        }
    })

    it("GET /categories/{id}/subcategories - returns category subcategories (200)", async () => {
        const response = await categoryService.getCategorySubcategories();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('subcategories').that.is.an('array');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('depth').that.is.a('number');
        if (response.data.subcategories && response.data.subcategories.length > 0) {
            const subcat = response.data.subcategories[0];
            expect(subcat).to.have.property('id').that.is.a('number');
            expect(subcat).to.have.property('name').that.is.a('string');
            expect(subcat).to.have.property('description').that.is.a('string');
            expect(subcat).to.have.property('status').that.is.a('string');
            expect(subcat).to.have.property('productCount').that.is.a('number');
        }
    })

    it("GET /categories/{id}/trending-products - returns trending products (200)", async () => {
        const response = await categoryService.getCategoryTrendingProducts();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('period').that.is.a('string');
        expect(response.data).to.have.property('trendingProducts').that.is.an('array');
        expect(response.data).to.have.property('totalTrendingProducts').that.is.a('number');
        if (response.data.trendingProducts && response.data.trendingProducts.length > 0) {
            const product = response.data.trendingProducts[0];
            expect(product).to.have.property('productId').that.is.a('number');
            expect(product).to.have.property('productName').that.is.a('string');
            expect(product).to.have.property('salesCount').that.is.a('number');
            expect(product).to.have.property('revenue').that.is.a('number');
            expect(product).to.have.property('price').that.is.a('number');
            expect(product).to.have.property('status').that.is.a('string');
        }
    })

    it("GET /categories/{id}/growth-rate - returns category growth rate (200)", async () => {
        const response = await categoryService.getCategoryGrowthRate();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('growthRate').that.is.an('object');
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('monthlyBreakdown').that.is.an('array');
        expect(response.data.growthRate).to.have.property('revenueGrowthRate').that.is.a('number');
        expect(response.data.growthRate).to.have.property('salesGrowthRate').that.is.a('number');
        expect(response.data.growthRate).to.have.property('ordersGrowthRate').that.is.a('number');
        expect(response.data.growthRate).to.have.property('growthTrend').that.is.a('string');
        expect(response.data.summary).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.summary).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.summary).to.have.property('totalSales').that.is.a('number');
        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('averageMonthlyRevenue').that.is.a('number');
        expect(response.data.summary).to.have.property('monthsAnalyzed').that.is.a('number');
        if (response.data.monthlyBreakdown && response.data.monthlyBreakdown.length > 0) {
            const month = response.data.monthlyBreakdown[0];
            expect(month).to.have.property('month').that.is.a('string');
            expect(month).to.have.property('revenue').that.is.a('number');
            expect(month).to.have.property('sales').that.is.a('number');
            expect(month).to.have.property('orders').that.is.a('number');
        }
    })

    it("GET /categories/{id}/market-share - returns category market share (200)", async () => {
        const response = await categoryService.getCategoryMarketShare();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('marketShare').that.is.an('object');
        expect(response.data).to.have.property('performance').that.is.an('object');
        expect(response.data).to.have.property('ranking').that.is.an('object');
        expect(response.data.marketShare).to.have.property('revenueShare').that.is.a('number');
        expect(response.data.marketShare).to.have.property('salesShare').that.is.a('number');
        expect(response.data.marketShare).to.have.property('orderShare').that.is.a('number');
        expect(response.data.marketShare).to.have.property('averageOrderValue').that.is.a('number');
        expect(response.data.performance).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.performance).to.have.property('totalSales').that.is.a('number');
        expect(response.data.performance).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.performance).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.ranking).to.have.property('revenueRank').that.is.a('number');
        expect(response.data.ranking).to.have.property('totalCategories').that.is.a('number');
    })

    it("GET /categories/performance-comparison - returns performance comparison (200)", async () => {
        const response = await categoryService.getCategoriesPerformanceComparison();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sortBy').that.is.a('string');
        expect(response.data).to.have.property('totalCategories').that.is.a('number');
        expect(response.data).to.have.property('comparison').that.is.an('array');
        if (response.data.comparison && response.data.comparison.length > 0) {
            const cat = response.data.comparison[0];
            expect(cat).to.have.property('categoryId').that.is.a('number');
            expect(cat).to.have.property('categoryName').that.is.a('string');
            expect(cat).to.have.property('totalProducts').that.is.a('number');
            expect(cat).to.have.property('activeProducts').that.is.a('number');
            expect(cat).to.have.property('totalSales').that.is.a('number');
            expect(cat).to.have.property('totalRevenue').that.is.a('number');
            expect(cat).to.have.property('totalStock').that.is.a('number');
            expect(cat).to.have.property('averagePrice').that.is.a('number');
            expect(cat).to.have.property('averageOrderValue').that.is.a('number');
        }
    })

    it("GET /statistics/category-product - returns category product statistics (200)", async () => {
        const response = await categoryService.getStatisticsCategoryProduct();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
    })

    it("GET /categories/{id}/revenue-trend - returns category revenue trend (200)", async () => {
        const response = await categoryService.getCategoryRevenueTrend();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('period').that.is.a('string');
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('trend').that.is.an('array');
        expect(response.data.summary).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('totalItems').that.is.a('number');
        expect(response.data.summary).to.have.property('averageRevenue').that.is.a('number');
        expect(response.data.summary).to.have.property('growthRate').that.is.a('number');
        expect(response.data.summary).to.have.property('periodsCount').that.is.a('number');
        if (response.data.trend && response.data.trend.length > 0) {
            const trendItem = response.data.trend[0];
            expect(trendItem).to.have.property('period').that.is.a('string');
            expect(trendItem).to.have.property('revenue').that.is.a('number');
            expect(trendItem).to.have.property('orderCount').that.is.a('number');
            expect(trendItem).to.have.property('itemCount').that.is.a('number');
        }
    })

    it("GET /categories/{id}/reviews-statistics - returns category reviews statistics (200)", async () => {
        const response = await categoryService.getCategoryReviewsStatistics();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data).to.have.property('productsWithReviews').that.is.a('number');
        expect(response.data).to.have.property('topReviewedProducts').that.is.an('array');
        expect(response.data.averageRating).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.most(5);
        if (response.data.topReviewedProducts && response.data.topReviewedProducts.length > 0) {
            const product = response.data.topReviewedProducts[0];
            expect(product).to.have.property('productId').that.is.a('number');
            expect(product).to.have.property('productName').that.is.a('string');
            expect(product).to.have.property('totalReviews').that.is.a('number');
            expect(product).to.have.property('averageRating').that.is.a('number');
            expect(product.averageRating).to.be.at.least(0);
            expect(product.averageRating).to.be.at.most(5);
        }
    })

    it("POST /categories/search - searches categories (200)", async () => {
        const response = await categoryService.searchCategories();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("array");
    })

    it("GET /orders/cancellation-analysis - returns cancellation analysis (200)", async () => {
        const response = await orderService.getOrdersCancellationAnalysis();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('cancellationByReason').that.is.an('object');
        expect(response.data).to.have.property('cancellationByPaymentMethod').that.is.an('object');
        expect(response.data).to.have.property('topCancellingUsers').that.is.an('array');
        expect(response.data).to.have.property('topCancelledCategories').that.is.an('array');
        expect(response.data).to.have.property('timeline').that.is.an('array');
        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('cancelledOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('cancellationRate').that.is.a('number');
        expect(response.data.summary).to.have.property('totalCancelledAmount').that.is.a('number');
        if (response.data.topCancellingUsers && response.data.topCancellingUsers.length > 0) {
            const user = response.data.topCancellingUsers[0];
            expect(user).to.have.property('userId').that.is.a('number');
            expect(user).to.have.property('userName').that.is.a('string');
            expect(user).to.have.property('cancellationCount').that.is.a('number');
            expect(user).to.have.property('totalAmount').that.is.a('number');
        }
        if (response.data.topCancelledCategories && response.data.topCancelledCategories.length > 0) {
            const cat = response.data.topCancelledCategories[0];
            expect(cat).to.have.property('categoryId').that.is.a('number');
            expect(cat).to.have.property('categoryName').that.is.a('string');
            expect(cat).to.have.property('cancellationCount').that.is.a('number');
            expect(cat).to.have.property('totalAmount').that.is.a('number');
        }
        if (response.data.timeline && response.data.timeline.length > 0) {
            const timeline = response.data.timeline[0];
            expect(timeline).to.have.property('month').that.is.a('string');
            expect(timeline).to.have.property('cancellationCount').that.is.a('number');
        }
    })

    it("POST /orders/create - creates order (201)", async () => {
        const response = await orderService.createOrder();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(201);
        expect(response.data).to.be.an("object");
        if (response.data.order) {
            expect(response.data.order).to.have.property('id').that.is.a('number');
            expect(response.data.order).to.have.property('userId').that.is.a('number');
            expect(response.data.order).to.have.property('items').that.is.an('array');
            expect(response.data.order).to.have.property('totalAmount').that.is.a('number');
            expect(response.data.order).to.have.property('status').that.is.a('string');
        } else {
            expect(response.data).to.have.property('id').that.is.a('number');
            expect(response.data).to.have.property('userId').that.is.a('number');
            expect(response.data).to.have.property('items').that.is.an('array');
            expect(response.data).to.have.property('totalAmount').that.is.a('number');
            expect(response.data).to.have.property('status').that.is.a('string');
        }
    })

    it("GET /orders/filter - filters orders (200)", async () => {
        const response = await orderService.filterOrders();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.a('string');
        if (response.data.type === 'status_orders') {
            expect(response.data).to.have.property('status').that.is.a('string');
            expect(response.data).to.have.property('orders').that.is.an('array');
            expect(response.data).to.have.property('totalOrders').that.is.a('number');
            if (response.data.orders && response.data.orders.length > 0) {
                const order = response.data.orders[0];
                expect(order).to.have.property('id').that.is.a('number');
                expect(order).to.have.property('userId').that.is.a('number');
                expect(order).to.have.property('totalAmount').that.is.a('number');
                if (order.status !== undefined) {
                    expect(order).to.have.property('status').that.is.a('string');
                }
            }
        }
    })

    it("POST /orders/fulfill - fulfills order (200)", async () => {
        const response = await orderService.fulfillOrder();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('success').that.is.a('boolean');
        expect(response.data).to.have.property('fulfillment').that.is.an('object');
        expect(response.data.fulfillment).to.have.property('previousStatus').that.is.a('string');
        expect(response.data.fulfillment).to.have.property('newStatus').that.is.a('string');
        expect(response.data.fulfillment).to.have.property('paymentStatus').that.is.a('string');
        expect(response.data.fulfillment).to.have.property('stockUpdated').that.is.a('boolean');
        if (response.data.fulfillment.stockUpdates !== undefined) {
            expect(response.data.fulfillment.stockUpdates).to.be.an('array');
        }
        if (response.data.warnings) {
            expect(response.data.warnings).to.be.an('array');
        }
    })

    it("GET /orders/fulfillment-status - returns fulfillment status (200)", async () => {
        const response = await orderService.getOrdersFulfillmentStatus();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('filters').that.is.an('object');
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('statusDistribution').that.is.an('object');
        expect(response.data).to.have.property('paymentStatusDistribution').that.is.an('object');
        expect(response.data).to.have.property('recentOrders').that.is.an('array');
        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.summary).to.have.property('totalItems').that.is.a('number');
        expect(response.data.summary).to.have.property('fulfillmentRate').that.is.a('number');
        expect(response.data.statusDistribution).to.have.property('pending').that.is.a('number');
        expect(response.data.statusDistribution).to.have.property('processing').that.is.a('number');
        expect(response.data.statusDistribution).to.have.property('shipped').that.is.a('number');
        expect(response.data.statusDistribution).to.have.property('delivered').that.is.a('number');
        if (response.data.recentOrders && response.data.recentOrders.length > 0) {
            const order = response.data.recentOrders[0];
            expect(order).to.have.property('orderId').that.is.a('number');
            expect(order).to.have.property('userId').that.is.a('number');
            expect(order).to.have.property('totalAmount').that.is.a('number');
            expect(order).to.have.property('status').that.is.a('string');
            expect(order).to.have.property('createdAt').that.is.a('number');
        }
    })

    it("GET /orders/{id}/details - returns order details (200)", async () => {
        const response = await orderService.getOrderDetails();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('orderId').that.is.a('number');
        expect(response.data).to.have.property('items').that.is.an('array');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data).to.have.property('status').that.is.a('string');
        if (response.data.user) {
            expect(response.data.user).to.have.property('id').that.is.a('number');
            expect(response.data.user).to.have.property('name').that.is.a('string');
            expect(response.data.user).to.have.property('email').that.is.a('string');
        }
        if (response.data.items && response.data.items.length > 0) {
            const item = response.data.items[0];
            expect(item).to.have.property('productId').that.is.a('number');
            expect(item).to.have.property('productName').that.is.a('string');
            expect(item).to.have.property('variantId');
            expect(item).to.have.property('quantity').that.is.a('number');
            expect(item).to.have.property('price').that.is.a('number');
            expect(item).to.have.property('subtotal').that.is.a('number');
        }
    })

    it("POST /orders/search - searches orders (200)", async () => {
        const response = await orderService.searchOrders();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("array");
        if (response.data.length > 0) {
            const order = response.data[0];
            expect(order).to.have.property('id').that.is.a('number');
            expect(order).to.have.property('userId').that.is.a('number');
            expect(order).to.have.property('totalAmount').that.is.a('number');
            expect(order).to.have.property('status').that.is.a('string');
            expect(order).to.have.property('createdAt').that.is.a('number');
        }
    })

    it("GET /orders/recent - returns recent orders (200)", async () => {
        const response = await orderService.getRecentOrders();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('limit').that.is.a('number');
        expect(response.data).to.have.property('orders').that.is.an('array');
        if (response.data.orders && response.data.orders.length > 0) {
            const order = response.data.orders[0];
            if (order.orderId !== undefined) {
                expect(order).to.have.property('orderId').that.is.a('number');
            } else {
                expect(order).to.have.property('id').that.is.a('number');
            }
            expect(order).to.have.property('userId').that.is.a('number');
            expect(order).to.have.property('totalAmount').that.is.a('number');
            expect(order).to.have.property('status').that.is.a('string');
            expect(order).to.have.property('createdAt').that.is.a('number');
        }
    })

    it("GET /orders/statistics - returns order statistics (200)", async () => {
        const response = await orderService.getOrdersStatistics();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data).to.have.property('averageOrderValue').that.is.a('number');
        expect(response.data).to.have.property('totalItems').that.is.a('number');
        expect(response.data).to.have.property('highestOrder').that.is.a('number');
        expect(response.data).to.have.property('lowestOrder').that.is.a('number');
        expect(response.data).to.have.property('statusDistribution').that.is.an('object');
        expect(response.data).to.have.property('paymentMethodDistribution').that.is.an('object');
    })

    it("POST /products/create-bundle - creates product bundle (201)", async () => {
        const response = await productService.createProductBundle();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(201);
        expect(response.data).to.be.an("object");
        if (response.data.bundle) {
            expect(response.data.bundle).to.have.property('id').that.is.a('number');
            expect(response.data.bundle).to.have.property('name').that.is.a('string');
            expect(response.data.bundle).to.have.property('products').that.is.an('array');
            expect(response.data.bundle).to.have.property('discount').that.is.a('number');
            expect(response.data.bundle).to.have.property('price').that.is.a('number');
        } else {
            expect(response.data).to.have.property('id').that.is.a('number');
            expect(response.data).to.have.property('name').that.is.a('string');
            expect(response.data).to.have.property('products').that.is.an('array');
            expect(response.data).to.have.property('discount').that.is.a('number');
            expect(response.data).to.have.property('price').that.is.a('number');
        }
    })

    it("GET /products/{id}/bundle-recommendations - returns bundle recommendations (200)", async () => {
        const response = await productService.getProductBundleRecommendations();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('bundleRecommendations').that.is.an('array');
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data.summary).to.have.property('totalBundles').that.is.a('number');
        expect(response.data.summary).to.have.property('averageBundleValue').that.is.a('number');
        expect(response.data.summary).to.have.property('recommendedCount').that.is.a('number');
        if (response.data.bundleRecommendations && response.data.bundleRecommendations.length > 0) {
            const rec = response.data.bundleRecommendations[0];
            expect(rec).to.have.property('productId').that.is.a('number');
            expect(rec).to.have.property('productName').that.is.a('string');
            expect(rec).to.have.property('categoryId').that.is.a('number');
            expect(rec).to.have.property('bundleFrequency').that.is.a('number');
            expect(rec).to.have.property('bundleRevenue').that.is.a('number');
            expect(rec).to.have.property('price').that.is.a('number');
        }
    })

    it("GET /products/search - searches products (200)", async () => {
        const response = await productService.searchProducts();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        if (response.data.products) {
            expect(response.data.products).to.be.an('array');
            if (response.data.products.length > 0) {
                const product = response.data.products[0];
                expect(product).to.have.property('id').that.is.a('number');
                expect(product).to.have.property('name').that.is.a('string');
                expect(product).to.have.property('price').that.is.a('number');
                expect(product).to.have.property('stock').that.is.a('number');
            }
        } else if (response.data.product) {
            expect(response.data.product).to.have.property('id').that.is.a('number');
            expect(response.data.product).to.have.property('name').that.is.a('string');
            expect(response.data.product).to.have.property('price').that.is.a('number');
        }
    })

    it("POST /products/search - searches products (200)", async () => {
        const response = await productService.searchProductsPost();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("array");
        if (response.data.length > 0) {
            const product = response.data[0];
            expect(product).to.have.property('id').that.is.a('number');
            expect(product).to.have.property('name').that.is.a('string');
            expect(product).to.have.property('price').that.is.a('number');
            expect(product).to.have.property('stock').that.is.a('number');
            expect(product).to.have.property('status').that.is.a('string');
        }
    })

    it("GET /products/{id}/cross-sell - returns cross-sell products (200)", async () => {
        const response = await productService.getProductCrossSell();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('totalOpportunities').that.is.a('number');
        expect(response.data).to.have.property('crossSellProducts').that.is.an('array');
        if (response.data.crossSellProducts && response.data.crossSellProducts.length > 0) {
            const product = response.data.crossSellProducts[0];
            expect(product).to.have.property('productId').that.is.a('number');
            expect(product).to.have.property('productName').that.is.a('string');
            expect(product).to.have.property('coOccurrenceCount').that.is.a('number');
            expect(product).to.have.property('totalRevenue').that.is.a('number');
            expect(product).to.have.property('price').that.is.a('number');
        }
    })

    it("GET /products/{id}/demand-analysis - returns demand analysis (200)", async () => {
        const response = await productService.getProductDemandAnalysis();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('currentStock').that.is.a('number');
        expect(response.data).to.have.property('demandAnalysis').that.is.an('object');
        expect(response.data).to.have.property('stockStatus').that.is.a('string');
        expect(response.data).to.have.property('recommendations').that.is.an('array');
    })

    it("GET /products/low-stock - returns low stock products (200)", async () => {
        const response = await productService.getLowStockProducts();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        if (response.data.totalProducts !== undefined) {
            expect(response.data.totalProducts).to.be.a('number');
        }
        if (response.data.threshold !== undefined) {
            expect(response.data.threshold).to.be.a('number');
        }
        if (response.data.lowStockProducts) {
            expect(response.data.lowStockProducts).to.be.an('array');
            if (response.data.lowStockProducts.length > 0) {
                const product = response.data.lowStockProducts[0];
                expect(product).to.have.property('productId').that.is.a('number');
                expect(product).to.have.property('productName').that.is.a('string');
                expect(product).to.have.property('currentStock').that.is.a('number');
            }
        }
    })

    it("GET /products/{id}/popularity-score - returns popularity score (200)", async () => {
        const response = await productService.getProductPopularityScore();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('popularityScore').that.is.a('number');
        expect(response.data).to.have.property('popularityLevel').that.is.a('string');
        expect(response.data).to.have.property('scoreBreakdown').that.is.an('object');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data.scoreBreakdown).to.have.property('salesVolume').that.is.a('number');
        expect(response.data.scoreBreakdown).to.have.property('revenue').that.is.a('number');
        expect(response.data.scoreBreakdown).to.have.property('customerBase').that.is.a('number');
        expect(response.data.scoreBreakdown).to.have.property('reviews').that.is.a('number');
        expect(response.data.scoreBreakdown).to.have.property('rating').that.is.a('number');
        expect(response.data.metrics).to.have.property('totalSales').that.is.a('number');
        expect(response.data.metrics).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.metrics).to.have.property('orderCount').that.is.a('number');
        expect(response.data.metrics).to.have.property('uniqueCustomers').that.is.a('number');
        expect(response.data.metrics).to.have.property('reviewCount').that.is.a('number');
        expect(response.data.metrics).to.have.property('averageRating').that.is.a('number');
        expect(response.data.metrics.averageRating).to.be.at.least(0);
        expect(response.data.metrics.averageRating).to.be.at.most(5);
    })

    it("GET /products/{id}/price-trend - returns price trend (200)", async () => {
        const response = await productService.getProductPriceTrend();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('currentPrice').that.is.a('number');
        expect(response.data).to.have.property('priceRange').that.is.an('object');
        expect(response.data).to.have.property('priceChange').that.is.an('object');
        expect(response.data).to.have.property('priceHistoryCount').that.is.a('number');
        expect(response.data).to.have.property('recentPrices').that.is.an('array');
        expect(response.data.priceRange).to.have.property('min').that.is.a('number');
        expect(response.data.priceRange).to.have.property('max').that.is.a('number');
        expect(response.data.priceRange).to.have.property('average').that.is.a('number');
        expect(response.data.priceChange).to.have.property('absolute').that.is.a('number');
        expect(response.data.priceChange).to.have.property('percentage').that.is.a('number');
        expect(response.data.priceChange).to.have.property('trend').that.is.a('string');
        if (response.data.recentPrices && response.data.recentPrices.length > 0) {
            const price = response.data.recentPrices[0];
            expect(price).to.have.property('price').that.is.a('number');
            expect(price).to.have.property('date').that.is.a('number');
        }
    })

    it("GET /products/{id}/review-sales-correlation - returns review sales correlation (200)", async () => {
        const response = await productService.getProductReviewSalesCorrelation();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('reviewStats').that.is.an('object');
        expect(response.data).to.have.property('salesStats').that.is.an('object');
        expect(response.data).to.have.property('correlation').that.is.an('object');
        expect(response.data.reviewStats).to.have.property('totalReviews').that.is.a('number');
        expect(response.data.reviewStats).to.have.property('averageRating').that.is.a('number');
        expect(response.data.reviewStats.averageRating).to.be.at.least(0);
        expect(response.data.reviewStats.averageRating).to.be.at.most(5);
        expect(response.data.salesStats).to.have.property('totalSales').that.is.a('number');
        expect(response.data.salesStats).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.salesStats).to.have.property('ordersCount').that.is.a('number');
        expect(response.data.correlation).to.have.property('hasReviews').that.is.a('boolean');
        expect(response.data.correlation).to.have.property('hasSales').that.is.a('boolean');
    })

    it("GET /products/{id}/reviews-summary - returns product reviews summary (200)", async () => {
        const response = await productService.getProductReviewsSummary();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data).to.have.property('ratingDistribution').that.is.an('object');
        expect(response.data).to.have.property('recentReviews').that.is.an('array');
        expect(response.data.averageRating).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.most(5);
    })

    it("GET /products/{id}/sales-forecast - returns sales forecast (200)", async () => {
        const response = await productService.getProductSalesForecast();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('analysisPeriod').that.is.an('object');
        expect(response.data).to.have.property('historicalData').that.is.an('object');
        expect(response.data).to.have.property('forecast').that.is.an('object');
        expect(response.data).to.have.property('trend').that.is.a('string');
        expect(response.data).to.have.property('confidence').that.is.a('string');
        expect(response.data.analysisPeriod).to.have.property('days').that.is.a('number');
        expect(response.data.historicalData).to.have.property('totalSales').that.is.a('number');
        expect(response.data.historicalData).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.historicalData).to.have.property('averageDailySales').that.is.a('number');
        expect(response.data.forecast).to.have.property('nextWeek').that.is.a('number');
        expect(response.data.forecast).to.have.property('nextMonth').that.is.a('number');
        expect(response.data.forecast).to.have.property('nextQuarter').that.is.a('number');
    })

    it("GET /products/{id}/recommendations - returns product recommendations (200)", async () => {
        const response = await productService.getProductRecommendations();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('recommendations').that.is.an('array');
        expect(response.data).to.have.property('totalRecommendations').that.is.a('number');
        if (response.data.recommendations && response.data.recommendations.length > 0) {
            const rec = response.data.recommendations[0];
            expect(rec).to.have.property('productId').that.is.a('number');
            expect(rec).to.have.property('productName').that.is.a('string');
            expect(rec).to.have.property('price').that.is.a('number');
            expect(rec).to.have.property('stock').that.is.a('number');
            expect(rec).to.have.property('status').that.is.a('string');
        }
    })

    it("GET /products/{id}/sales-stats - returns product sales stats (200)", async () => {
        const response = await productService.getProductSalesStats();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('totalSales').that.is.a('number');
        expect(response.data).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data).to.have.property('ordersCount').that.is.a('number');
        expect(response.data).to.have.property('averageOrderValue').that.is.a('number');
    })

    it("GET /products/{id}/stock-movement - returns stock movement (200)", async () => {
        const response = await productService.getProductStockMovement();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('currentStock').that.is.a('number');
        if (response.data.movementHistory) {
            if (Array.isArray(response.data.movementHistory)) {
                expect(response.data.movementHistory).to.be.an('array');
            } else {
                expect(response.data.movementHistory).to.be.an('object');
            }
        }
        if (response.data.stockAnalysis) {
            expect(response.data.stockAnalysis).to.be.an('object');
        }
        if (response.data.stockStatus) {
            expect(response.data.stockStatus).to.be.a('string');
        }
    })

    it("GET /products/{id}/variants-summary - returns variants summary (200)", async () => {
        const response = await productService.getProductVariantsSummary();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('totalVariants').that.is.a('number');
        expect(response.data).to.have.property('totalVariantStock').that.is.a('number');
        expect(response.data).to.have.property('availableVariants').that.is.a('number');
        expect(response.data).to.have.property('outOfStockVariants').that.is.a('number');
        expect(response.data).to.have.property('variantPriceRange').that.is.an('object');
        expect(response.data).to.have.property('variants').that.is.an('array');
        expect(response.data.variantPriceRange).to.have.property('min').that.is.a('number');
        expect(response.data.variantPriceRange).to.have.property('max').that.is.a('number');
        if (response.data.variants && response.data.variants.length > 0) {
            const variant = response.data.variants[0];
            expect(variant).to.have.property('id');
            expect(variant).to.have.property('price').that.is.a('number');
            expect(variant).to.have.property('stock').that.is.a('number');
            expect(variant).to.have.property('isAvailable').that.is.a('boolean');
        }
    })

    it("GET /products/top-reviewed - returns top reviewed products (200)", async () => {
        const response = await productService.getTopReviewedProducts();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('limit').that.is.a('number');
        expect(response.data).to.have.property('topReviewedProducts').that.is.an('array');
        if (response.data.topReviewedProducts && response.data.topReviewedProducts.length > 0) {
            const product = response.data.topReviewedProducts[0];
            expect(product).to.have.property('productId').that.is.a('number');
            expect(product).to.have.property('productName').that.is.a('string');
            expect(product).to.have.property('totalReviews').that.is.a('number');
            expect(product).to.have.property('averageRating').that.is.a('number');
            expect(product.averageRating).to.be.at.least(0);
            expect(product.averageRating).to.be.at.most(5);
        }
    })

    it("GET /reviews/analysis - returns reviews analysis (200)", async () => {
        const response = await reviewService.getReviewsAnalysis();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        if (response.data.totalReviews !== undefined) {
            expect(response.data.totalReviews).to.be.a('number');
        }
        if (response.data.averageRating !== undefined) {
            expect(response.data.averageRating).to.be.a('number');
            expect(response.data.averageRating).to.be.at.least(0);
            expect(response.data.averageRating).to.be.at.most(5);
        }
        if (response.data.ratingDistribution) {
            expect(response.data.ratingDistribution).to.be.an('object');
        }
        if (response.data.productsWithReviews !== undefined) {
            expect(response.data.productsWithReviews).to.be.a('number');
        }
    })

    it("POST /reviews/search - searches reviews (200)", async () => {
        const response = await reviewService.searchReviews();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("array");
        if (response.data.length > 0) {
            const review = response.data[0];
            expect(review).to.have.property('id').that.is.a('number');
            expect(review).to.have.property('productId').that.is.a('number');
            expect(review).to.have.property('userId').that.is.a('number');
            expect(review).to.have.property('rating').that.is.a('number');
            expect(review.rating).to.be.at.least(1);
            expect(review.rating).to.be.at.most(5);
            expect(review).to.have.property('comment').that.is.a('string');
        }
    })

    it("GET /sellers/{id}/customer-retention - returns customer retention (200)", async () => {
        const response = await sellerService.getSellerCustomerRetention();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('retention').that.is.an('object');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('topCustomers').that.is.an('array');
    })

    it("GET /sellers/ranking - returns sellers ranking (200)", async () => {
        const response = await sellerService.getSellersRanking();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        if (response.data.totalSellers !== undefined) {
            expect(response.data.totalSellers).to.be.a('number');
        }
        if (response.data.sellers) {
            expect(response.data.sellers).to.be.an('array');
            if (response.data.sellers.length > 0) {
                const seller = response.data.sellers[0];
                expect(seller).to.have.property('sellerId').that.is.a('number');
                expect(seller).to.have.property('sellerName').that.is.a('string');
                expect(seller).to.have.property('rank').that.is.a('number');
                expect(seller).to.have.property('totalRevenue').that.is.a('number');
            }
        }
    })

    it("GET /sellers/{id}/product-portfolio - returns product portfolio (200)", async () => {
        const response = await sellerService.getSellerProductPortfolio();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('portfolio').that.is.an('object');
        expect(response.data).to.have.property('sales').that.is.an('object');
        if (response.data.categoryDistribution) {
            if (Array.isArray(response.data.categoryDistribution)) {
                expect(response.data.categoryDistribution).to.be.an('array');
            } else {
                expect(response.data.categoryDistribution).to.be.an('object');
            }
        }
    })

    it("GET /sellers/{id}/revenue-forecast - returns revenue forecast (200)", async () => {
        const response = await sellerService.getSellerRevenueForecast();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('historicalData').that.is.an('object');
        expect(response.data).to.have.property('forecast').that.is.an('object');
        expect(response.data).to.have.property('topProducts').that.is.an('array');
    })

    it("GET /sellers/{sellerId}/analytics - returns seller analytics (200)", async () => {
        const response = await sellerService.getSellerAnalytics();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('activeProducts').that.is.a('number');
        expect(response.data).to.have.property('totalSales').that.is.a('number');
        expect(response.data).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data).to.have.property('averageProductPrice').that.is.a('number');
        expect(response.data).to.have.property('totalStock').that.is.a('number');
    })

    it("GET /sellers/{sellerId}/dashboard - returns seller dashboard (200)", async () => {
        const response = await sellerService.getSellerDashboard();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('activeProducts').that.is.a('number');
        expect(response.data).to.have.property('totalSales').that.is.a('number');
        expect(response.data).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data).to.have.property('topSellingProducts').that.is.an('array');
    })

    it("GET /users/{id}/total-spent - returns user total spent (200)", async () => {
        const response = await userService.getUserTotalSpent();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('ordersCount').that.is.a('number');
        expect(response.data).to.have.property('total').that.is.a('number');
    })

    it("GET /users/{id}/churn-analysis - returns churn analysis (200)", async () => {
        const response = await userService.getUserChurnAnalysis();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('churnRisk').that.is.a('string');
        expect(response.data).to.have.property('churnScore').that.is.a('number');
        expect(response.data).to.have.property('riskFactors').that.is.an('array');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('activity').that.is.an('object');
    })

    it("GET /users/{id}/engagement-score - returns engagement score (200)", async () => {
        const response = await userService.getUserEngagementScore();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('engagementScore').that.is.a('number');
        expect(response.data).to.have.property('engagementLevel').that.is.a('string');
        expect(response.data).to.have.property('scoreBreakdown').that.is.an('object');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('activity').that.is.an('object');
    })

    it("GET /users/{id}/lifetime-value - returns lifetime value (200)", async () => {
        const response = await userService.getUserLifetimeValue();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        if (typeof response.data.lifetimeValue === 'object') {
            expect(response.data.lifetimeValue).to.be.an('object');
        } else {
            expect(response.data.lifetimeValue).to.be.a('number');
        }
        expect(response.data).to.have.property('segment').that.is.a('string');
        expect(response.data).to.have.property('topCategories').that.is.an('array');
    })

    it("GET /users/{id}/order-timeline - returns order timeline (200)", async () => {
        const response = await userService.getUserOrderTimeline();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('period').that.is.a('string');
        expect(response.data).to.have.property('totalPeriods').that.is.a('number');
        expect(response.data).to.have.property('timeline').that.is.an('array');
        if (response.data.timeline && response.data.timeline.length > 0) {
            const timelineItem = response.data.timeline[0];
            expect(timelineItem).to.have.property('period').that.is.a('string');
            expect(timelineItem).to.have.property('orderCount').that.is.a('number');
            expect(timelineItem).to.have.property('totalAmount').that.is.a('number');
        }
    })

    it("GET /users/{id}/payment-methods-summary - returns payment methods summary (200)", async () => {
        const response = await userService.getUserPaymentMethodsSummary();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data).to.have.property('preferredMethod').that.is.a('string');
        if (response.data.paymentMethods) {
            if (Array.isArray(response.data.paymentMethods)) {
                expect(response.data.paymentMethods).to.be.an('array');
            } else {
                expect(response.data.paymentMethods).to.be.an('object');
            }
        }
    })

    it("POST /users/purchase-analysis - returns purchase analysis (200)", async () => {
        const response = await userService.getUserPurchaseAnalysis();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        if (response.data.totalOrders !== undefined) {
            expect(response.data.totalOrders).to.be.a('number');
        }
        if (response.data.totalSpent !== undefined) {
            expect(response.data.totalSpent).to.be.a('number');
        }
        if (response.data.averageOrderValue !== undefined) {
            expect(response.data.averageOrderValue).to.be.a('number');
        }
        if (response.data.categoryBreakdown) {
            expect(response.data.categoryBreakdown).to.be.an('object');
        }
    })

    it("GET /users/{id}/return-rate - returns return rate (200)", async () => {
        const response = await userService.getUserReturnRate();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('returnRate').that.is.a('number');
        expect(response.data).to.have.property('returnRateLevel').that.is.a('string');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('activity').that.is.an('object');
    })

    it("GET /users/{id}/reviews-history - returns reviews history (200)", async () => {
        const response = await userService.getUserReviewsHistory();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data.averageRating).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.most(5);
        expect(response.data).to.have.property('reviewsByProductCount').that.is.a('number');
        expect(response.data).to.have.property('reviews').that.is.an('array');
        if (response.data.reviews && response.data.reviews.length > 0) {
            const review = response.data.reviews[0];
            if (review.id !== undefined) {
                expect(review).to.have.property('id').that.is.a('number');
            } else if (review.reviewId !== undefined) {
                expect(review).to.have.property('reviewId').that.is.a('number');
            }
            expect(review).to.have.property('productId').that.is.a('number');
            expect(review).to.have.property('rating').that.is.a('number');
            expect(review.rating).to.be.at.least(1);
            expect(review.rating).to.be.at.most(5);
        }
    })

    it("GET /users/{id}/activity - returns user activity (200)", async () => {
        const response = await userService.getUserActivity();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalSpent').that.is.a('number');
        expect(response.data).to.have.property('recentOrders').that.is.an('array');
        expect(response.data).to.have.property('topCategories').that.is.an('array');
        if (response.data.lastActivity !== null && response.data.lastActivity !== undefined) {
            expect(response.data.lastActivity).to.be.a('number');
        }
        expect(response.data).to.have.property('isActive').that.is.a('boolean');
    })

    it("POST /users/search - searches users (200)", async () => {
        const response = await userService.searchUsers();
        if (typeof response !== "object") {
            return;
        }
        if (response.status === 404) {
            expect(response.status).to.be.equal(404);
            expect(response.data).to.be.an("array");
        } else {
            expect(response.status).to.be.equal(200);
            expect(response.data).to.be.an("array");
        }
    })

    it("GET /analytics/user-seller - returns user seller analytics (200)", async () => {
        const response = await analyticsService.getUserSellerAnalytics();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        if (response.data.totalUsers !== undefined) {
            expect(response.data.totalUsers).to.be.a('number');
        }
        if (response.data.totalSellers !== undefined) {
            expect(response.data.totalSellers).to.be.a('number');
        }
        if (response.data.totalOrders !== undefined) {
            expect(response.data.totalOrders).to.be.a('number');
        }
        if (response.data.totalRevenue !== undefined) {
            expect(response.data.totalRevenue).to.be.a('number');
        }
        if (response.data.userStats) {
            expect(response.data.userStats).to.be.an('object');
        }
        if (response.data.sellerStats) {
            expect(response.data.sellerStats).to.be.an('object');
        }
    })

    it("GET /users/{id}/shopping-patterns - returns shopping patterns (200)", async () => {
        const response = await userService.getUserShoppingPatterns();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('summary').that.is.an('object');
        if (response.data.patterns) {
            if (Array.isArray(response.data.patterns)) {
                expect(response.data.patterns).to.be.an('array');
            } else {
                expect(response.data.patterns).to.be.an('object');
            }
        }
        if (response.data.categoryPreferences) {
            if (Array.isArray(response.data.categoryPreferences)) {
                expect(response.data.categoryPreferences).to.be.an('array');
            } else {
                expect(response.data.categoryPreferences).to.be.an('object');
            }
        }
        if (response.data.favoriteCategory !== null && response.data.favoriteCategory !== undefined) {
            expect(response.data.favoriteCategory).to.be.a('string');
        }
    })

    it("GET /users/{id}/order-history - returns order history (200)", async () => {
        const response = await userService.getUserOrderHistory();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('orders').that.is.an('array');
        expect(response.data).to.have.property('totalSpent').that.is.a('number');
        if (response.data.favoriteCategory !== null && response.data.favoriteCategory !== undefined) {
            expect(response.data.favoriteCategory).to.be.a('string');
        }
        if (response.data.orders && response.data.orders.length > 0) {
            const order = response.data.orders[0];
            expect(order).to.have.property('id').that.is.a('number');
            expect(order).to.have.property('totalAmount').that.is.a('number');
            expect(order).to.have.property('status').that.is.a('string');
        }
    })

    it("GET /users/{id}/purchase-summary - returns purchase summary (200)", async () => {
        const response = await userService.getUserPurchaseSummary();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalSpent').that.is.a('number');
        expect(response.data).to.have.property('averageOrderValue').that.is.a('number');
        if (response.data.mostPurchasedCategory !== null && response.data.mostPurchasedCategory !== undefined) {
            if (typeof response.data.mostPurchasedCategory === 'string') {
                expect(response.data.mostPurchasedCategory).to.be.a('string');
            } else {
                expect(response.data.mostPurchasedCategory).to.be.an('object');
            }
        }
        if (response.data.mostPurchasedProduct !== null && response.data.mostPurchasedProduct !== undefined) {
            if (typeof response.data.mostPurchasedProduct === 'string') {
                expect(response.data.mostPurchasedProduct).to.be.a('string');
            } else {
                expect(response.data.mostPurchasedProduct).to.be.an('object');
            }
        }
    })
});

