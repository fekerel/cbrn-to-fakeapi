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
});

