import { expect } from "chai";
import { specialEndpointService } from "@/api/fakeApi/SpecialEndpointService";

describe.only("Special Endpoint Tests", function () {
    this.timeout(20000);

    it("Get Product Sales Stats By ID", async () => {
        const response = await specialEndpointService.getProductSalesStatsByID();
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

        expect(response.data.totalSales).to.be.at.least(0);
        expect(response.data.totalRevenue).to.be.at.least(0);
        expect(response.data.ordersCount).to.be.at.least(0);
        expect(response.data.averageOrderValue).to.be.at.least(0);
    });

    it("Get Category Products Summary By ID", async () => {
        const response = await specialEndpointService.getCategoryProductsSummaryByID();

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

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.most(response.data.totalProducts);
        expect(response.data.totalStock).to.be.at.least(0);
        expect(response.data.averagePrice).to.be.at.least(0);

        expect(response.data.priceRange).to.have.property('min').that.is.a('number');
        expect(response.data.priceRange).to.have.property('max').that.is.a('number');
        expect(response.data.priceRange.min).to.be.at.least(0);
        expect(response.data.priceRange.max).to.be.at.least(response.data.priceRange.min);
    });

    it("Get User Order History By ID", async () => {
        const response = await specialEndpointService.getUserOrderHistoryByID();

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
        expect(response.data).to.have.property('favoriteCategory');

        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.totalSpent).to.be.at.least(0);
        expect(response.data.orders.length).to.be.equal(response.data.totalOrders);

        if (response.data.orders.length > 0) {
            const firstOrder = response.data.orders[0];
            expect(firstOrder).to.be.an("object");
            expect(firstOrder).to.have.property('id').that.is.a('number');
            expect(firstOrder).to.have.property('totalAmount').that.is.a('number');
            expect(firstOrder).to.have.property('status').that.is.a('string');
            expect(firstOrder).to.have.property('paymentMethod');
            expect(firstOrder).to.have.property('createdAt');
            expect(firstOrder).to.have.property('itemsCount').that.is.a('number');

            expect(firstOrder.totalAmount).to.be.at.least(0);
            expect(firstOrder.itemsCount).to.be.at.least(0);

            expect(firstOrder.status).to.be.oneOf([
                "delivered", "cancelled", "returned", "failed", "pending", "processing", "shipped"
            ]);

            if (firstOrder.paymentMethod !== null) {
                expect(firstOrder.paymentMethod).to.be.oneOf([
                    'credit_card',
                    'paypal',
                    'bank_transfer'
                ]);
            }
        }

        if (response.data.favoriteCategory !== null) {
            expect(response.data.favoriteCategory).to.be.a('string');
        }
    });

    it("Get Seller Dashboard By ID", async () => {
        const response = await specialEndpointService.getSellerDashboardByID();

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
        expect(response.data).to.have.property('productsByCategory').that.is.an('array');

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.most(response.data.totalProducts);
        expect(response.data.totalSales).to.be.at.least(0);
        expect(response.data.totalRevenue).to.be.at.least(0);

        expect(response.data.topSellingProducts.length).to.be.at.most(5);

        if (response.data.topSellingProducts.length > 0) {
            const topProduct = response.data.topSellingProducts[0];
            expect(topProduct).to.be.an("object");
            expect(topProduct).to.have.property('productId').that.is.a('number');
            expect(topProduct).to.have.property('productName').that.is.a('string');
            expect(topProduct).to.have.property('salesCount').that.is.a('number');
            expect(topProduct).to.have.property('revenue').that.is.a('number');

            expect(topProduct.salesCount).to.be.at.least(0);
            expect(topProduct.revenue).to.be.at.least(0);
        }

        if (response.data.productsByCategory.length > 0) {
            const categoryItem = response.data.productsByCategory[0];
            expect(categoryItem).to.be.an("object");
            expect(categoryItem).to.have.property('categoryId').that.is.a('number');
            expect(categoryItem).to.have.property('categoryName').that.is.a('string');
            expect(categoryItem).to.have.property('productCount').that.is.a('number');

            expect(categoryItem.productCount).to.be.at.least(0);
        }
    });

    it("Get Category Subcategories By ID", async () => {
        const response = await specialEndpointService.getCategorySubcategoriesByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('parentId');
        expect(response.data).to.have.property('subcategories').that.is.an('array');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('depth').that.is.a('number');

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.depth).to.be.at.least(0);

        if (response.data.subcategories.length > 0) {
            const subcategory = response.data.subcategories[0];
            expect(subcategory).to.be.an("object");
            expect(subcategory).to.have.property('id').that.is.a('number');
            expect(subcategory).to.have.property('name').that.is.a('string');
            expect(subcategory).to.have.property('description').that.is.a('string');
            expect(subcategory).to.have.property('status').that.is.a('string');
            expect(subcategory).to.have.property('productCount').that.is.a('number');

            expect(subcategory.productCount).to.be.at.least(0);
            expect(subcategory.status).to.be.oneOf(['active', 'inactive']);
        }
    });

    it("Get Order Details By ID", async () => {
        const response = await specialEndpointService.getOrderDetailsByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('orderId').that.is.a('number');
        expect(response.data).to.have.property('user');
        expect(response.data).to.have.property('items').that.is.an('array');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data).to.have.property('shippingAddress');
        expect(response.data).to.have.property('payment');
        expect(response.data).to.have.property('status').that.is.a('string');
        expect(response.data).to.have.property('createdAt');
        expect(response.data).to.have.property('modifiedAt');

        expect(response.data.totalAmount).to.be.at.least(0);

        if (response.data.user !== null) {
            expect(response.data.user).to.be.an("object");
            expect(response.data.user).to.have.property('id').that.is.a('number');
            expect(response.data.user).to.have.property('name').that.is.a('string');
            expect(response.data.user).to.have.property('email').that.is.a('string');
        }

        expect(response.data.items.length).to.be.at.least(0);

        if (response.data.items.length > 0) {
            const firstItem = response.data.items[0];
            expect(firstItem).to.be.an("object");
            expect(firstItem).to.have.property('productId').that.is.a('number');
            expect(firstItem).to.have.property('productName').that.is.a('string');
            expect(firstItem).to.have.property('categoryName');
            expect(firstItem).to.have.property('variantId');
            expect(firstItem).to.have.property('quantity').that.is.a('number');
            expect(firstItem).to.have.property('price').that.is.a('number');
            expect(firstItem).to.have.property('subtotal').that.is.a('number');

            expect(firstItem.quantity).to.be.at.least(0);
            expect(firstItem.price).to.be.at.least(0);
            expect(firstItem.subtotal).to.be.at.least(0);
            expect(firstItem.subtotal).to.be.equal(firstItem.quantity * firstItem.price);
        }

        if (response.data.shippingAddress !== null) {
            expect(response.data.shippingAddress).to.be.an("object");
        }

        if (response.data.payment !== null) {
            expect(response.data.payment).to.be.an("object");
        }

        expect(response.data.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed", "pending", "processing", "shipped"
        ]);
    });

    it("Get Product Variants Summary By ID", async () => {
        const response = await specialEndpointService.getProductVariantsSummaryByID();

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
        expect(response.data).to.have.property('colorDistribution').that.is.an('object');
        expect(response.data).to.have.property('sizeDistribution').that.is.an('object');
        expect(response.data).to.have.property('variants').that.is.an('array');
        expect(response.data.totalVariants).to.be.at.least(0);
        expect(response.data.totalVariantStock).to.be.at.least(0);
        expect(response.data.availableVariants).to.be.at.least(0);
        expect(response.data.outOfStockVariants).to.be.at.least(0);
        expect(response.data.availableVariants + response.data.outOfStockVariants).to.be.equal(response.data.totalVariants);

        expect(response.data.variantPriceRange).to.have.property('min').that.is.a('number');
        expect(response.data.variantPriceRange).to.have.property('max').that.is.a('number');
        expect(response.data.variantPriceRange.min).to.be.at.least(0);
        expect(response.data.variantPriceRange.max).to.be.at.least(response.data.variantPriceRange.min);

        expect(response.data.variants.length).to.be.equal(response.data.totalVariants);

        if (response.data.variants.length > 0) {
            const firstVariant = response.data.variants[0];
            expect(firstVariant).to.be.an("object");
            expect(firstVariant).to.have.property('id');
            expect(firstVariant).to.have.property('color');
            expect(firstVariant).to.have.property('size');
            expect(firstVariant).to.have.property('price').that.is.a('number');
            expect(firstVariant).to.have.property('stock').that.is.a('number');
            expect(firstVariant).to.have.property('isAvailable').that.is.a('boolean');

            expect(firstVariant.price).to.be.at.least(0);
            expect(firstVariant.stock).to.be.at.least(0);
            expect(firstVariant.isAvailable).to.be.equal(firstVariant.stock > 0);
        }
    });

    it("Get User Purchase Summary By ID", async () => {
        const response = await specialEndpointService.getUserPurchaseSummaryByID();


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
        expect(response.data).to.have.property('mostPurchasedCategory');
        expect(response.data).to.have.property('mostPurchasedProduct');

        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.totalSpent).to.be.at.least(0);
        expect(response.data.averageOrderValue).to.be.at.least(0);

        if (response.data.totalOrders > 0) {
            const calculatedAverage = Number((response.data.totalSpent / response.data.totalOrders).toFixed(2));
            expect(response.data.averageOrderValue).to.be.equal(calculatedAverage);
        } else {
            expect(response.data.averageOrderValue).to.be.equal(0);
        }

        if (response.data.mostPurchasedCategory !== null) {
            expect(response.data.mostPurchasedCategory).to.be.an("object");
            expect(response.data.mostPurchasedCategory).to.have.property('categoryId').that.is.a('number');
            expect(response.data.mostPurchasedCategory).to.have.property('categoryName').that.is.a('string');
            expect(response.data.mostPurchasedCategory).to.have.property('totalQuantity').that.is.a('number');
            expect(response.data.mostPurchasedCategory.totalQuantity).to.be.at.least(0);
        }

        if (response.data.mostPurchasedProduct !== null) {
            expect(response.data.mostPurchasedProduct).to.be.an("object");
            expect(response.data.mostPurchasedProduct).to.have.property('productId').that.is.a('number');
            expect(response.data.mostPurchasedProduct).to.have.property('productName').that.is.a('string');
            expect(response.data.mostPurchasedProduct).to.have.property('totalQuantity').that.is.a('number');
            expect(response.data.mostPurchasedProduct.totalQuantity).to.be.at.least(0);
        }
    });

    it("Get Category Sales Stats By ID", async () => {
        const response = await specialEndpointService.getCategorySalesStatsByID();

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

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.totalSales).to.be.at.least(0);
        expect(response.data.totalRevenue).to.be.at.least(0);
        expect(response.data.averageOrderValue).to.be.at.least(0);

        expect(response.data.topSellingProducts.length).to.be.at.most(5);

        if (response.data.topSellingProducts.length > 0) {
            const topProduct = response.data.topSellingProducts[0];
            expect(topProduct).to.be.an("object");
            expect(topProduct).to.have.property('productId').that.is.a('number');
            expect(topProduct).to.have.property('productName').that.is.a('string');
            expect(topProduct).to.have.property('salesCount').that.is.a('number');
            expect(topProduct).to.have.property('revenue').that.is.a('number');

            expect(topProduct.salesCount).to.be.at.least(0);
            expect(topProduct.revenue).to.be.at.least(0);
        }
    });

    it("Get Recent Orders", async () => {
        const response = await specialEndpointService.getRecentOrders(10, 0);


        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('limit').that.is.a('number');
        expect(response.data).to.have.property('offset').that.is.a('number');
        expect(response.data).to.have.property('orders').that.is.an('array');

        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.limit).to.be.equal(10);
        expect(response.data.offset).to.be.equal(0);
        expect(response.data.orders.length).to.be.at.most(response.data.limit);

        if (response.data.orders.length > 0) {
            const firstOrder = response.data.orders[0];
            expect(firstOrder).to.be.an("object");
            expect(firstOrder).to.have.property('orderId').that.is.a('number');
            expect(firstOrder).to.have.property('userId').that.is.a('number');
            expect(firstOrder).to.have.property('userName').that.is.a('string');
            expect(firstOrder).to.have.property('totalAmount').that.is.a('number');
            expect(firstOrder).to.have.property('status').that.is.a('string');
            expect(firstOrder).to.have.property('paymentMethod');
            expect(firstOrder).to.have.property('itemsCount').that.is.a('number');
            expect(firstOrder).to.have.property('createdAt');

            expect(firstOrder.totalAmount).to.be.at.least(0);
            expect(firstOrder.itemsCount).to.be.at.least(0);

            expect(firstOrder.status).to.be.oneOf([
                "delivered", "cancelled", "returned", "failed", "pending", "processing", "shipped"
            ]);

            if (firstOrder.paymentMethod !== null) {
                expect(firstOrder.paymentMethod).to.be.oneOf([
                    'credit_card',
                    'paypal',
                    'bank_transfer'
                ]);
            }
        }
    });


    it("Get Product Recommendations By ID", async () => {
        const response = await specialEndpointService.getProductRecommendationsByID(5);

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

        expect(response.data.totalRecommendations).to.be.at.least(0);
        expect(response.data.recommendations.length).to.be.at.most(5);
        expect(response.data.recommendations.length).to.be.equal(response.data.totalRecommendations);

        if (response.data.recommendations.length > 0) {
            const recommendation = response.data.recommendations[0];
            expect(recommendation).to.be.an("object");
            expect(recommendation).to.have.property('productId').that.is.a('number');
            expect(recommendation).to.have.property('productName').that.is.a('string');
            expect(recommendation).to.have.property('price').that.is.a('number');
            expect(recommendation).to.have.property('stock').that.is.a('number');
            expect(recommendation).to.have.property('status').that.is.a('string');
            expect(recommendation).to.have.property('tags').that.is.an('array');

            expect(recommendation.productId).to.not.be.equal(response.data.productId);
            expect(recommendation.price).to.be.at.least(0);
            expect(recommendation.stock).to.be.at.least(0);
            expect(recommendation.status).to.be.oneOf(['active', 'inactive']);

            if (recommendation.tags.length > 0) {
                recommendation.tags.forEach(tag => {
                    expect(tag).to.be.a('string');
                });
            }
        }
    });

    it("Get User Activity By ID", async () => {
        const response = await specialEndpointService.getUserActivityByID();

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
        expect(response.data).to.have.property('lastActivity');
        expect(response.data).to.have.property('isActive').that.is.a('boolean');

        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.totalSpent).to.be.at.least(0);
        expect(response.data.recentOrders.length).to.be.at.most(5);
        expect(response.data.topCategories.length).to.be.at.most(3);

        if (response.data.recentOrders.length > 0) {
            const recentOrder = response.data.recentOrders[0];
            expect(recentOrder).to.be.an("object");
            expect(recentOrder).to.have.property('orderId').that.is.a('number');
            expect(recentOrder).to.have.property('totalAmount').that.is.a('number');
            expect(recentOrder).to.have.property('status').that.is.a('string');
            expect(recentOrder).to.have.property('createdAt');

            expect(recentOrder.totalAmount).to.be.at.least(0);
            expect(recentOrder.status).to.be.oneOf([
                "delivered", "cancelled", "returned", "failed", "pending", "processing", "shipped"
            ]);
        }

        if (response.data.topCategories.length > 0) {
            const topCategory = response.data.topCategories[0];
            expect(topCategory).to.be.an("object");
            expect(topCategory).to.have.property('categoryId').that.is.a('number');
            expect(topCategory).to.have.property('categoryName').that.is.a('string');
            expect(topCategory).to.have.property('orderCount').that.is.a('number');

            expect(topCategory.orderCount).to.be.at.least(0);
        }

        expect(response.data.isActive).to.be.equal(response.data.totalOrders > 0);
    });

    it("Get Order Statistics", async () => {
        const response = await specialEndpointService.getOrderStatistics();

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

        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.totalRevenue).to.be.at.least(0);
        expect(response.data.averageOrderValue).to.be.at.least(0);
        expect(response.data.totalItems).to.be.at.least(0);
        expect(response.data.highestOrder).to.be.at.least(0);
        expect(response.data.lowestOrder).to.be.at.least(0);
        expect(response.data.lowestOrder).to.be.at.most(response.data.highestOrder);

        if (response.data.totalOrders > 0) {
            const calculatedAverage = Number((response.data.totalRevenue / response.data.totalOrders).toFixed(2));
            expect(response.data.averageOrderValue).to.be.equal(calculatedAverage);
        } else {
            expect(response.data.averageOrderValue).to.be.equal(0);
        }

        // Status distribution kontrolü
        const statusKeys = Object.keys(response.data.statusDistribution);
        if (statusKeys.length > 0) {
            statusKeys.forEach(status => {
                expect(response.data.statusDistribution[status]).to.be.a('number');
                expect(response.data.statusDistribution[status]).to.be.at.least(0);
            });
        }

        // Payment method distribution kontrolü
        const paymentKeys = Object.keys(response.data.paymentMethodDistribution);
        if (paymentKeys.length > 0) {
            paymentKeys.forEach(method => {
                expect(response.data.paymentMethodDistribution[method]).to.be.a('number');
                expect(response.data.paymentMethodDistribution[method]).to.be.at.least(0);
            });
        }
    });

    it("Get Category Trending Products By ID", async () => {
        const response = await specialEndpointService.getCategoryTrendingProductsByID(10);

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

        expect(response.data.totalTrendingProducts).to.be.at.least(0);
        expect(response.data.trendingProducts.length).to.be.at.most(10);
        expect(response.data.trendingProducts.length).to.be.equal(response.data.totalTrendingProducts);

        if (response.data.trendingProducts.length > 0) {
            const trendingProduct = response.data.trendingProducts[0];
            expect(trendingProduct).to.be.an("object");
            expect(trendingProduct).to.have.property('productId').that.is.a('number');
            expect(trendingProduct).to.have.property('productName').that.is.a('string');
            expect(trendingProduct).to.have.property('salesCount').that.is.a('number');
            expect(trendingProduct).to.have.property('revenue').that.is.a('number');
            expect(trendingProduct).to.have.property('price').that.is.a('number');
            expect(trendingProduct).to.have.property('status').that.is.a('string');

            expect(trendingProduct.salesCount).to.be.at.least(0);
            expect(trendingProduct.revenue).to.be.at.least(0);
            expect(trendingProduct.price).to.be.at.least(0);
            expect(trendingProduct.status).to.be.oneOf(['active', 'inactive']);
        }
    });

    it("Get Seller Analytics By ID", async () => {
        const response = await specialEndpointService.getSellerAnalyticsByID();
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
        expect(response.data).to.have.property('topCategory');
        expect(response.data).to.have.property('monthlyRevenue').that.is.an('object');

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.least(0);
        expect(response.data.activeProducts).to.be.at.most(response.data.totalProducts);
        expect(response.data.totalSales).to.be.at.least(0);
        expect(response.data.totalRevenue).to.be.at.least(0);
        expect(response.data.averageProductPrice).to.be.at.least(0);
        expect(response.data.totalStock).to.be.at.least(0);

        if (response.data.topCategory !== null) {
            expect(response.data.topCategory).to.be.an("object");
            expect(response.data.topCategory).to.have.property('categoryId').that.is.a('number');
            expect(response.data.topCategory).to.have.property('categoryName').that.is.a('string');
            expect(response.data.topCategory).to.have.property('productCount').that.is.a('number');
            expect(response.data.topCategory.productCount).to.be.at.least(0);
        }

        // Monthly revenue kontrolü
        const monthlyKeys = Object.keys(response.data.monthlyRevenue);
        if (monthlyKeys.length > 0) {
            monthlyKeys.forEach(month => {
                expect(response.data.monthlyRevenue[month]).to.be.a('number');
                expect(response.data.monthlyRevenue[month]).to.be.at.least(0);
            });
        }
    });



    it("Get Product Reviews Summary By ID", async () => {
        const response = await specialEndpointService.getProductReviewsSummaryByID();

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

        expect(response.data.totalReviews).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.least(0).and.at.most(5);

        // Rating distribution kontrolü
        expect(response.data.ratingDistribution).to.have.property('1').that.is.a('number');
        expect(response.data.ratingDistribution).to.have.property('2').that.is.a('number');
        expect(response.data.ratingDistribution).to.have.property('3').that.is.a('number');
        expect(response.data.ratingDistribution).to.have.property('4').that.is.a('number');
        expect(response.data.ratingDistribution).to.have.property('5').that.is.a('number');

        Object.keys(response.data.ratingDistribution).forEach(rating => {
            expect(response.data.ratingDistribution[rating]).to.be.at.least(0);
        });

        expect(response.data.recentReviews.length).to.be.at.most(5);

        if (response.data.recentReviews.length > 0) {
            const recentReview = response.data.recentReviews[0];
            expect(recentReview).to.be.an("object");
            expect(recentReview).to.have.property('reviewId').that.is.a('number');
            expect(recentReview).to.have.property('userId').that.is.a('number');
            expect(recentReview).to.have.property('userName').that.is.a('string');
            expect(recentReview).to.have.property('rating').that.is.a('number');
            expect(recentReview.rating).to.be.at.least(1).and.at.most(5);
            expect(recentReview).to.have.property('createdAt').that.is.a('number');

            if (recentReview.comment !== null && recentReview.comment !== undefined) {
                expect(recentReview.comment).to.be.a('string');
            }
        }
    });

    it("Get User Reviews History By ID", async () => {
        const response = await specialEndpointService.getUserReviewsHistoryByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data).to.have.property('reviewsByProductCount').that.is.a('number');
        expect(response.data).to.have.property('reviews').that.is.an('array');

        expect(response.data.totalReviews).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.least(0).and.at.most(5);
        expect(response.data.reviewsByProductCount).to.be.at.least(0);
        expect(response.data.reviews.length).to.be.equal(response.data.totalReviews);

        if (response.data.reviews.length > 0) {
            const firstReview = response.data.reviews[0];
            expect(firstReview).to.be.an("object");
            expect(firstReview).to.have.property('reviewId').that.is.a('number');
            expect(firstReview).to.have.property('productId').that.is.a('number');
            expect(firstReview).to.have.property('productName').that.is.a('string');
            expect(firstReview).to.have.property('rating').that.is.a('number');
            expect(firstReview.rating).to.be.at.least(1).and.at.most(5);
            expect(firstReview).to.have.property('createdAt').that.is.a('number');

            if (firstReview.comment !== null && firstReview.comment !== undefined) {
                expect(firstReview.comment).to.be.a('string');
            }
        }
    });

    it("Get Top Reviewed Products", async () => {
        const response = await specialEndpointService.getTopReviewedProducts(10);

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('limit').that.is.a('number');
        expect(response.data).to.have.property('topReviewedProducts').that.is.an('array');

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.limit).to.be.equal(10);
        expect(response.data.topReviewedProducts.length).to.be.at.most(response.data.limit);

        if (response.data.topReviewedProducts.length > 0) {
            const topProduct = response.data.topReviewedProducts[0];
            expect(topProduct).to.be.an("object");
            expect(topProduct).to.have.property('productId').that.is.a('number');
            expect(topProduct).to.have.property('productName').that.is.a('string');
            expect(topProduct).to.have.property('categoryId').that.is.a('number');
            expect(topProduct).to.have.property('categoryName').that.is.a('string');
            expect(topProduct).to.have.property('totalReviews').that.is.a('number');
            expect(topProduct).to.have.property('averageRating').that.is.a('number');
            expect(topProduct).to.have.property('latestReviewDate').that.is.a('number');

            expect(topProduct.totalReviews).to.be.at.least(0);
            expect(topProduct.averageRating).to.be.at.least(0).and.at.most(5);
        }
    });

    it("Get Category Reviews Statistics By ID", async () => {
        const response = await specialEndpointService.getCategoryReviewsStatisticsByID();

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

        expect(response.data.totalProducts).to.be.at.least(0);
        expect(response.data.totalReviews).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.least(0).and.at.most(5);
        expect(response.data.productsWithReviews).to.be.at.least(0);
        expect(response.data.productsWithReviews).to.be.at.most(response.data.totalProducts);

        expect(response.data.topReviewedProducts.length).to.be.at.most(5);

        if (response.data.topReviewedProducts.length > 0) {
            const topProduct = response.data.topReviewedProducts[0];
            expect(topProduct).to.be.an("object");
            expect(topProduct).to.have.property('productId').that.is.a('number');
            expect(topProduct).to.have.property('productName').that.is.a('string');
            expect(topProduct).to.have.property('totalReviews').that.is.a('number');
            expect(topProduct).to.have.property('averageRating').that.is.a('number');

            expect(topProduct.totalReviews).to.be.at.least(0);
            expect(topProduct.averageRating).to.be.at.least(0).and.at.most(5);
        }
    });

    it("Get Product Review and Sales Correlation By ID", async () => {
        const response = await specialEndpointService.getProductReviewSalesCorrelationByID();

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
        expect(response.data.reviewStats.totalReviews).to.be.at.least(0);
        expect(response.data.reviewStats.averageRating).to.be.at.least(0).and.at.most(5);

        expect(response.data.salesStats).to.have.property('totalSales').that.is.a('number');
        expect(response.data.salesStats).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.salesStats).to.have.property('ordersCount').that.is.a('number');
        expect(response.data.salesStats.totalSales).to.be.at.least(0);
        expect(response.data.salesStats.totalRevenue).to.be.at.least(0);
        expect(response.data.salesStats.ordersCount).to.be.at.least(0);

        expect(response.data.correlation).to.have.property('salesByRating').that.is.an('object');
        expect(response.data.correlation).to.have.property('hasReviews').that.is.a('boolean');
        expect(response.data.correlation).to.have.property('hasSales').that.is.a('boolean');

        // Sales by rating kontrolü
        expect(response.data.correlation.salesByRating).to.have.property('1').that.is.an('object');
        expect(response.data.correlation.salesByRating).to.have.property('2').that.is.an('object');
        expect(response.data.correlation.salesByRating).to.have.property('3').that.is.an('object');
        expect(response.data.correlation.salesByRating).to.have.property('4').that.is.an('object');
        expect(response.data.correlation.salesByRating).to.have.property('5').that.is.an('object');

        Object.keys(response.data.correlation.salesByRating).forEach(rating => {
            const ratingData = response.data.correlation.salesByRating[rating];
            expect(ratingData).to.have.property('sales').that.is.a('number');
            expect(ratingData).to.have.property('revenue').that.is.a('number');
            expect(ratingData.sales).to.be.at.least(0);
            expect(ratingData.revenue).to.be.at.least(0);
        });
    });


    it("Get User Order Timeline By ID", async () => {
        const response = await specialEndpointService.getUserOrderTimelineByID('monthly');

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

        expect(response.data.period).to.be.oneOf(['daily', 'weekly', 'monthly']);
        expect(response.data.totalPeriods).to.be.at.least(0);

        if (response.data.timeline.length > 0) {
            const firstPeriod = response.data.timeline[0];
            expect(firstPeriod).to.be.an("object");
            expect(firstPeriod).to.have.property('period').that.is.a('string');
            expect(firstPeriod).to.have.property('orderCount').that.is.a('number');
            expect(firstPeriod).to.have.property('totalAmount').that.is.a('number');
            expect(firstPeriod).to.have.property('orders').that.is.an('array');

            expect(firstPeriod.orderCount).to.be.at.least(0);
            expect(firstPeriod.totalAmount).to.be.at.least(0);

            if (firstPeriod.orders.length > 0) {
                const firstOrder = firstPeriod.orders[0];
                expect(firstOrder).to.have.property('orderId').that.is.a('number');
                expect(firstOrder).to.have.property('totalAmount').that.is.a('number');
                expect(firstOrder).to.have.property('status').that.is.a('string');
                expect(firstOrder).to.have.property('createdAt').that.is.a('number');
            }
        }
    });

    it("Get Product Inventory Alert", async () => {
        const response = await specialEndpointService.getProductInventoryAlert(5000);

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('threshold').that.is.a('number');
        expect(response.data).to.have.property('totalLowStockProducts').that.is.a('number');
        expect(response.data).to.have.property('products').that.is.an('array');

        expect(response.data.threshold).to.be.at.least(0);
        expect(response.data.totalLowStockProducts).to.be.at.least(0);

        if (response.data.products.length > 0) {
            const firstProduct = response.data.products[0];
            expect(firstProduct).to.be.an("object");
            expect(firstProduct).to.have.property('productId').that.is.a('number');
            expect(firstProduct).to.have.property('productName').that.is.a('string');
            expect(firstProduct).to.have.property('totalStock').that.is.a('number');
            expect(firstProduct.totalStock).to.be.at.most(response.data.threshold);
        }
    });

    it("Get Category Performance Comparison", async () => {
        const response = await specialEndpointService.getCategoryPerformanceComparison(10, 'totalRevenue');

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sortBy').that.is.a('string');
        expect(response.data).to.have.property('totalCategories').that.is.a('number');
        expect(response.data).to.have.property('comparison').that.is.an('array');

        expect(response.data.sortBy).to.be.oneOf(['totalRevenue', 'totalSales', 'totalProducts', 'averagePrice']);

        if (response.data.comparison.length > 0) {
            const firstCategory = response.data.comparison[0];
            expect(firstCategory).to.be.an("object");
            expect(firstCategory).to.have.property('categoryId').that.is.a('number');
            expect(firstCategory).to.have.property('categoryName').that.is.a('string');
            expect(firstCategory).to.have.property('totalProducts').that.is.a('number');
            expect(firstCategory).to.have.property('totalRevenue').that.is.a('number');
            expect(firstCategory.totalRevenue).to.be.at.least(0);
        }
    });

    it("Get Seller Performance Ranking", async () => {
        const response = await specialEndpointService.getSellerPerformanceRanking(10, 'totalRevenue');

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sortBy').that.is.a('string');
        expect(response.data).to.have.property('limit').that.is.a('number');
        expect(response.data).to.have.property('totalSellers').that.is.a('number');
        expect(response.data).to.have.property('ranking').that.is.an('array');

        expect(response.data.ranking.length).to.be.at.most(response.data.limit);

        if (response.data.ranking.length > 0) {
            const firstSeller = response.data.ranking[0];
            expect(firstSeller).to.be.an("object");
            expect(firstSeller).to.have.property('rank').that.is.a('number');
            expect(firstSeller).to.have.property('sellerId').that.is.a('number');
            expect(firstSeller).to.have.property('totalRevenue').that.is.a('number');
            expect(firstSeller.rank).to.be.equal(1);
        }
    });

    it("Get User Lifetime Value By ID", async () => {
        const response = await specialEndpointService.getUserLifetimeValueByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('lifetimeValue').that.is.an('object');
        expect(response.data).to.have.property('segment').that.is.a('string');
        expect(response.data).to.have.property('topCategories').that.is.an('array');

        expect(response.data.segment).to.be.oneOf(['new', 'regular', 'loyal', 'vip']);

        expect(response.data.lifetimeValue).to.have.property('totalSpent').that.is.a('number');
        expect(response.data.lifetimeValue).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.lifetimeValue.totalSpent).to.be.at.least(0);
    });

    it("Get Product Cross-Sell By ID", async () => {
        const response = await specialEndpointService.getProductCrossSellByID(5);

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('totalOpportunities').that.is.a('number');
        expect(response.data).to.have.property('crossSellProducts').that.is.an('array');

        expect(response.data.crossSellProducts.length).to.be.at.most(5);

        if (response.data.crossSellProducts.length > 0) {
            const firstProduct = response.data.crossSellProducts[0];
            expect(firstProduct).to.be.an("object");
            expect(firstProduct).to.have.property('productId').that.is.a('number');
            expect(firstProduct).to.have.property('coOccurrenceCount').that.is.a('number');
            expect(firstProduct.coOccurrenceCount).to.be.at.least(0);
            expect(firstProduct.productId).to.not.be.equal(response.data.productId);
        }
    });

    it("Get Order Fulfillment Status", async () => {
        const response = await specialEndpointService.getOrderFulfillmentStatus();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('statusDistribution').that.is.an('object');
        expect(response.data).to.have.property('paymentStatusDistribution').that.is.an('object');

        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary).to.have.property('fulfillmentRate').that.is.a('number');
        expect(response.data.summary.fulfillmentRate).to.be.at.least(0).and.at.most(100);
    });


    it("Get User Payment Methods Summary By ID", async () => {
        const response = await specialEndpointService.getUserPaymentMethodsSummaryByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('userName').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('preferredMethod').that.is.a('string');
        expect(response.data).to.have.property('paymentMethods').that.is.an('object');

        expect(response.data.preferredMethod).to.be.oneOf(['credit_card', 'paypal', 'bank_transfer']);

        expect(response.data.paymentMethods).to.have.property('credit_card').that.is.an('object');
        expect(response.data.paymentMethods.credit_card).to.have.property('usageCount').that.is.a('number');
        expect(response.data.paymentMethods.credit_card).to.have.property('usagePercentage').that.is.a('number');
        expect(response.data.paymentMethods.credit_card.usagePercentage).to.be.at.least(0).and.at.most(100);
    });

    it("Get Product Price Trend By ID", async () => {
        const response = await specialEndpointService.getProductPriceTrendByID();

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

        expect(response.data.currentPrice).to.be.at.least(0);
        expect(response.data.priceRange).to.have.property('min').that.is.a('number');
        expect(response.data.priceRange).to.have.property('max').that.is.a('number');
        expect(response.data.priceChange).to.have.property('trend').that.is.oneOf(['increasing', 'decreasing', 'stable']);
    });

    it("Get Seller Product Portfolio By ID", async () => { /////////////////////
        const response = await specialEndpointService.getSellerProductPortfolioByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('sellerName').that.is.a('string');
        expect(response.data).to.have.property('portfolio').that.is.an('object');
        expect(response.data).to.have.property('sales').that.is.an('object');
        expect(response.data).to.have.property('categoryDistribution').that.is.an('array');

        expect(response.data.portfolio).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.portfolio.totalProducts).to.be.at.least(0);
        expect(response.data.sales).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.sales.totalRevenue).to.be.at.least(0);
    });

    it("Get Category Revenue Trend By ID", async () => {
        const response = await specialEndpointService.getCategoryRevenueTrendByID();

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

        expect(response.data.period).to.be.oneOf(['daily', 'weekly', 'monthly']);
        expect(response.data.summary).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.summary.totalRevenue).to.be.at.least(0);
    });

    it("Get User Shopping Patterns By ID", async () => {
        const response = await specialEndpointService.getUserShoppingPatternsByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('patterns').that.is.an('object');
        expect(response.data).to.have.property('categoryPreferences').that.is.an('array');

        expect(response.data.patterns).to.have.property('preferredTimeOfDay').that.is.oneOf(['morning', 'afternoon', 'evening', 'night']);
        expect(response.data.summary).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.summary.totalOrders).to.be.at.least(0);
    });

    it("Get Product Stock Movement By ID", async () => {
        const response = await specialEndpointService.getProductStockMovementByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('currentStock').that.is.a('number');
        expect(response.data).to.have.property('stockAnalysis').that.is.an('object');
        expect(response.data).to.have.property('stockStatus').that.is.oneOf(['low', 'medium', 'high']);

        expect(response.data.currentStock).to.be.at.least(0);
        expect(response.data.stockAnalysis).to.have.property('totalSold').that.is.a('number');
        expect(response.data.stockAnalysis.totalSold).to.be.at.least(0);
    });

    it("Get Order Cancellation Analysis", async () => {
        const response = await specialEndpointService.getOrderCancellationAnalysis();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('summary').that.is.an('object');
        expect(response.data).to.have.property('cancellationByReason').that.is.an('object');
        expect(response.data).to.have.property('topCancellingUsers').that.is.an('array');

        expect(response.data.summary).to.have.property('cancellationRate').that.is.a('number');
        expect(response.data.summary.cancellationRate).to.be.at.least(0).and.at.most(100);
    });

    it("Get User Engagement Score By ID", async () => {
        const response = await specialEndpointService.getUserEngagementScoreByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('engagementScore').that.is.a('number');
        expect(response.data).to.have.property('engagementLevel').that.is.oneOf(['inactive', 'low', 'medium', 'high']);
        expect(response.data).to.have.property('scoreBreakdown').that.is.an('object');

        expect(response.data.engagementScore).to.be.at.least(0).and.at.most(100);
        expect(response.data.scoreBreakdown).to.have.property('orderActivity').that.is.a('number');
        expect(response.data.scoreBreakdown.orderActivity).to.be.at.least(0);
    });




    it("Get Product Popularity Score By ID", async () => {
        const response = await specialEndpointService.getProductPopularityScoreByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('popularityScore').that.is.a('number');
        expect(response.data).to.have.property('popularityLevel').that.is.oneOf(['very_low', 'low', 'medium', 'high', 'very_high']);
        expect(response.data).to.have.property('scoreBreakdown').that.is.an('object');
        expect(response.data).to.have.property('metrics').that.is.an('object');

        expect(response.data.popularityScore).to.be.at.least(0).and.at.most(100);
        expect(response.data.metrics).to.have.property('totalSales').that.is.a('number');
        expect(response.data.metrics.totalSales).to.be.at.least(0);
    });

    it("Get Category Market Share By ID", async () => {
        const response = await specialEndpointService.getCategoryMarketShareByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('marketShare').that.is.an('object');
        expect(response.data).to.have.property('performance').that.is.an('object');
        expect(response.data).to.have.property('ranking').that.is.an('object');

        expect(response.data.marketShare).to.have.property('revenueShare').that.is.a('number');
        expect(response.data.marketShare.revenueShare).to.be.at.least(0).and.at.most(100);
        expect(response.data.ranking).to.have.property('revenueRank').that.is.a('number');
        expect(response.data.ranking.revenueRank).to.be.at.least(1);
    });

    it("Get Seller Customer Retention By ID", async () => {
        const response = await specialEndpointService.getSellerCustomerRetentionByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('retention').that.is.an('object');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('topCustomers').that.is.an('array');

        expect(response.data.retention).to.have.property('retentionRate').that.is.a('number');
        expect(response.data.retention.retentionRate).to.be.at.least(0).and.at.most(100);
        expect(response.data.retention).to.have.property('totalCustomers').that.is.a('number');
        expect(response.data.retention.totalCustomers).to.be.at.least(0);
    });

    it("Get User Return Rate By ID", async () => {
        const response = await specialEndpointService.getUserReturnRateByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('returnRate').that.is.a('number');
        expect(response.data).to.have.property('returnRateLevel').that.is.oneOf(['very_low', 'low', 'medium', 'high', 'very_high']);
        expect(response.data).to.have.property('metrics').that.is.an('object');

        expect(response.data.returnRate).to.be.at.least(0).and.at.most(100);
        expect(response.data.metrics).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.metrics.totalOrders).to.be.at.least(0);
    });

    it("Get Product Bundle Recommendations By ID", async () => {
        const response = await specialEndpointService.getProductBundleRecommendationsByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('bundleRecommendations').that.is.an('array');
        expect(response.data).to.have.property('summary').that.is.an('object');

        expect(response.data.bundleRecommendations.length).to.be.at.most(5);

        if (response.data.bundleRecommendations.length > 0) {
            const firstBundle = response.data.bundleRecommendations[0];
            expect(firstBundle).to.be.an("object");
            expect(firstBundle).to.have.property('productId').that.is.a('number');
            expect(firstBundle).to.have.property('bundleFrequency').that.is.a('number');
            expect(firstBundle.bundleFrequency).to.be.at.least(0);
            expect(firstBundle.productId).to.not.be.equal(response.data.productId);
        }
    });

    it("Get User-Seller Combined Analytics - No Parameters", async () => {
        const response = await specialEndpointService.getUserSellerAnalyticsNoParams();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('general');
        expect(response.data).to.have.property('analytics').that.is.an('object');
        expect(response.data.analytics).to.have.property('totalUsers').that.is.a('number');
        expect(response.data.analytics).to.have.property('totalSellers').that.is.a('number');
        expect(response.data.analytics).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.analytics).to.have.property('totalProducts').that.is.a('number');
    });

    it("Get User-Seller Combined Analytics - UserId Only", async () => {
        const response = await specialEndpointService.getUserSellerAnalyticsUserIdOnly();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('user_only');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('analytics').that.is.an('object');
        expect(response.data.analytics).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.analytics).to.have.property('totalSpent').that.is.a('number');
        expect(response.data.analytics.totalSpent).to.be.at.least(0);
    });

    ////////////////////////////////

    it("Get User-Seller Combined Analytics - SellerId Only", async () => {
        const response = await specialEndpointService.getUserSellerAnalyticsSellerIdOnly();

        if (typeof response !== "object") {
            return;
        }



        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('seller_only');
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('analytics').that.is.an('object');
        expect(response.data.analytics).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.analytics).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.analytics.totalRevenue).to.be.at.least(0);
    });

    it("Get User-Seller Combined Analytics - Both Parameters", async () => {
        const response = await specialEndpointService.getUserSellerAnalyticsBoth();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('user_seller_combined');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('sellerId').that.is.a('number');
        expect(response.data).to.have.property('analytics').that.is.an('object');
        expect(response.data.analytics).to.have.property('orderCount').that.is.a('number');
        expect(response.data.analytics.orderCount).to.be.at.least(0);
    });

    it("Get Product-Category Search - No Parameters", async () => {
        const response = await specialEndpointService.getProductCategorySearchNoParams();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('all_products');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('products').that.is.an('array');
        expect(response.data.totalProducts).to.be.at.least(0);
    });

    it("Get Product-Category Search - ProductId Only", async () => {
        const response = await specialEndpointService.getProductCategorySearchProductIdOnly();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('single_product');
        expect(response.data).to.have.property('product').that.is.an('object');
        expect(response.data.product).to.have.property('id').that.is.a('number');
        expect(response.data.product).to.have.property('name').that.is.a('string');
        expect(response.data.product).to.have.property('price').that.is.a('number');
        expect(response.data.product.price).to.be.at.least(0);
    });

    it("Get Product-Category Search - CategoryId Only", async () => {
        const response = await specialEndpointService.getProductCategorySearchCategoryIdOnly();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_products');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('categoryName').that.is.a('string');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('products').that.is.an('array');
    });

    it("Get Product-Category Search - Status Only", async () => {
        const response = await specialEndpointService.getProductCategorySearchStatusOnly();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('status_products');
        expect(response.data).to.have.property('status').that.is.oneOf(['active', 'inactive']);
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('products').that.is.an('array');
    });

    it("Get Product-Category Search - CategoryId and Status", async () => {
        const response = await specialEndpointService.getProductCategorySearchCategoryIdAndStatus();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_status');
        expect(response.data).to.have.property('categoryId').that.is.a('number');
        expect(response.data).to.have.property('status').that.is.oneOf(['active', 'inactive']);
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data).to.have.property('products').that.is.an('array');
    });

    it("Get Order Filter Analysis - No Parameters", async () => {
        const response = await specialEndpointService.getOrderFilterAnalysisNoParams();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('all_orders');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data).to.have.property('orders').that.is.an('array');
        expect(response.data.totalOrders).to.be.at.least(0);
        expect(response.data.totalAmount).to.be.at.least(0);
    });

    it("Get Order Filter Analysis - OrderId Only", async () => {
        const response = await specialEndpointService.getOrderFilterAnalysisOrderIdOnly();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('single_order');
        expect(response.data).to.have.property('order').that.is.an('object');
        expect(response.data.order).to.have.property('id').that.is.a('number');
        expect(response.data.order).to.have.property('totalAmount').that.is.a('number');
        expect(response.data.order).to.have.property('status').that.is.a('string');
        expect(response.data.order.totalAmount).to.be.at.least(0);
    });

    it("Get Order Filter Analysis - UserId Only", async () => {
        const response = await specialEndpointService.getOrderFilterAnalysisUserIdOnly();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('user_orders');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalSpent').that.is.a('number');
        expect(response.data).to.have.property('orders').that.is.an('array');
        expect(response.data.totalSpent).to.be.at.least(0);
    });

    it("Get Order Filter Analysis - UserId and Status", async () => {
        const response = await specialEndpointService.getOrderFilterAnalysisUserIdAndStatus();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('user_status_orders');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('status').that.is.a('string');
        expect(response.data).to.have.property('totalOrders').that.is.a('number');
        expect(response.data).to.have.property('totalAmount').that.is.a('number');
        expect(response.data.totalAmount).to.be.at.least(0);
    });

    it("Get Review-Product Analysis - No Parameters", async () => {
        const response = await specialEndpointService.getReviewProductAnalysisNoParams();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('all_reviews');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data).to.have.property('reviews').that.is.an('array');
        expect(response.data.totalReviews).to.be.at.least(0);
        expect(response.data.averageRating).to.be.at.least(0).and.at.most(5);
    });

    it("Get Review-Product Analysis - ProductId Only", async () => {
        const response = await specialEndpointService.getReviewProductAnalysisProductIdOnly();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('product_reviews');
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
        expect(response.data).to.have.property('averageRating').that.is.a('number');
        expect(response.data.averageRating).to.be.at.least(0).and.at.most(5);
    });

    it("Get Review-Product Analysis - ProductId and Rating", async () => {
        const response = await specialEndpointService.getReviewProductAnalysisProductIdAndRating();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('product_rating_reviews');
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('rating').that.is.a('number');
        expect(response.data.rating).to.be.at.least(1).and.at.most(5);
        expect(response.data).to.have.property('totalReviews').that.is.a('number');
    });

    it("Get Category-Product Statistics - No Parameters", async () => {
        const response = await specialEndpointService.getCategoryProductStatisticsNoParams();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('general_statistics');
        expect(response.data).to.have.property('statistics').that.is.an('object');
        expect(response.data.statistics).to.have.property('totalCategories').that.is.a('number');
        expect(response.data.statistics).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.statistics.totalCategories).to.be.at.least(0);
        expect(response.data.statistics.totalProducts).to.be.at.least(0);
    });

    it("Get Category-Product Statistics - CategoryId Only", async () => {
        const response = await specialEndpointService.getCategoryProductStatisticsCategoryIdOnly();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_stats');
        expect(response.data).to.have.property('category').that.is.an('object');
        expect(response.data.category).to.have.property('id').that.is.a('number');
        expect(response.data.category).to.have.property('name').that.is.a('string');
        expect(response.data).to.have.property('statistics').that.is.an('object');
        expect(response.data.statistics).to.have.property('totalProducts').that.is.a('number');
    });

    it("Get Category-Product Statistics - CategoryId with Products", async () => {
        const response = await specialEndpointService.getCategoryProductStatisticsCategoryIdWithProducts();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_with_products');
        expect(response.data).to.have.property('category').that.is.an('object');
        expect(response.data).to.have.property('products').that.is.an('array');
        expect(response.data).to.have.property('totalProducts').that.is.a('number');
        expect(response.data.totalProducts).to.be.at.least(0);
    });

    it("Get Category-Product Statistics - CategoryId with Sales", async () => {
        const response = await specialEndpointService.getCategoryProductStatisticsCategoryIdWithSales();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_sales_stats');
        expect(response.data).to.have.property('category').that.is.an('object');
        expect(response.data).to.have.property('sales').that.is.an('object');
        expect(response.data.sales).to.have.property('totalSales').that.is.a('number');
        expect(response.data.sales).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.sales.totalRevenue).to.be.at.least(0);
    });

    it("Get Category-Product Statistics - Full Stats", async () => {
        const response = await specialEndpointService.getCategoryProductStatisticsCategoryIdFull();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('type').that.is.equal('category_full_stats');
        expect(response.data).to.have.property('category').that.is.an('object');
        expect(response.data).to.have.property('products').that.is.an('array');
        expect(response.data).to.have.property('sales').that.is.an('object');
        expect(response.data).to.have.property('statistics').that.is.an('object');
        expect(response.data.sales).to.have.property('totalRevenue').that.is.a('number');
    });



    it("Get Product Sales Forecast By ID", async () => {
        const response = await specialEndpointService.getProductSalesForecastByID();

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
        expect(response.data).to.have.property('trend').that.is.oneOf(['increasing', 'decreasing', 'stable']);
        expect(response.data).to.have.property('confidence').that.is.oneOf(['low', 'medium', 'high']);

        expect(response.data.historicalData).to.have.property('totalSales').that.is.a('number');
        expect(response.data.historicalData.totalSales).to.be.at.least(0);
        expect(response.data.forecast).to.have.property('nextWeek').that.is.a('number');
        expect(response.data.forecast.nextWeek).to.be.at.least(0);
    });

    it("Get User Churn Analysis By ID", async () => {
        const response = await specialEndpointService.getUserChurnAnalysisByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('churnRisk').that.is.oneOf(['low', 'medium', 'high', 'very_high']);
        expect(response.data).to.have.property('churnScore').that.is.a('number');
        expect(response.data).to.have.property('riskFactors').that.is.an('array');
        expect(response.data).to.have.property('metrics').that.is.an('object');
        expect(response.data).to.have.property('activity').that.is.an('object');

        expect(response.data.churnScore).to.be.at.least(0).and.at.most(100);
        expect(response.data.metrics).to.have.property('totalOrders').that.is.a('number');
        expect(response.data.metrics.totalOrders).to.be.at.least(0);
        expect(response.data.activity).to.have.property('isActive').that.is.a('boolean');
    });

    it("Get Category Growth Rate By ID", async () => {
        const response = await specialEndpointService.getCategoryGrowthRateByID();

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
        expect(response.data.growthRate).to.have.property('growthTrend').that.is.oneOf(['strong_growth', 'growth', 'decline', 'strong_decline']);
        expect(response.data.summary).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.summary.totalRevenue).to.be.at.least(0);
    });

    it("Get Seller Revenue Forecast By ID", async () => {
        const response = await specialEndpointService.getSellerRevenueForecastByID();

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
        expect(response.data).to.have.property('portfolio').that.is.an('object');

        expect(response.data.historicalData).to.have.property('totalRevenue').that.is.a('number');
        expect(response.data.historicalData.totalRevenue).to.be.at.least(0);
        expect(response.data.forecast).to.have.property('nextMonth').that.is.a('number');
        expect(response.data.forecast.nextMonth).to.be.at.least(0);
    });

    it("Get Product Demand Analysis By ID", async () => {
        const response = await specialEndpointService.getProductDemandAnalysisByID();

        if (typeof response !== "object") {
            return;
        }


        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('productName').that.is.a('string');
        expect(response.data).to.have.property('currentStock').that.is.a('number');
        expect(response.data).to.have.property('demandAnalysis').that.is.an('object');
        expect(response.data).to.have.property('stockStatus').that.is.oneOf(['critical', 'low', 'adequate', 'high']);
        expect(response.data).to.have.property('recommendations').that.is.an('array');

        expect(response.data.currentStock).to.be.at.least(0);
        expect(response.data.demandAnalysis).to.have.property('totalDemand').that.is.a('number');
        expect(response.data.demandAnalysis.totalDemand).to.be.at.least(0);
        expect(response.data.demandAnalysis).to.have.property('demandLevel').that.is.oneOf(['very_low', 'low', 'medium', 'high']);
        expect(response.data.demandAnalysis).to.have.property('daysUntilStockout').that.is.a('number');
        expect(response.data.demandAnalysis.daysUntilStockout).to.be.at.least(0);
    });

});


