import { expect } from "chai";
import { specialEndpointService } from "@/api/fakeApi/SpecialEndpointService";
import { productService } from "@/api/fakeApi/ProductsService";
import { categoryService } from "@/api/fakeApi/CategoryService";
import { userService } from "@/api/fakeApi/UserService";
import { orderService } from "@/api/fakeApi/OrderService";

describe.only("Special Endpoint Tests", function () {
    this.timeout(20000);

    it("Get Product Sales Stats By ID", async () => {
        const response = await specialEndpointService.getProductSalesStatsByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('productId').that.is.a('number');
        expect(response).to.have.property('productName').that.is.a('string');
        expect(response).to.have.property('totalSales').that.is.a('number');
        expect(response).to.have.property('totalRevenue').that.is.a('number');
        expect(response).to.have.property('ordersCount').that.is.a('number');
        expect(response).to.have.property('averageOrderValue').that.is.a('number');

        expect(response.totalSales).to.be.at.least(0);
        expect(response.totalRevenue).to.be.at.least(0);
        expect(response.ordersCount).to.be.at.least(0);
        expect(response.averageOrderValue).to.be.at.least(0);
    });

    it("Get Category Products Summary By ID", async () => {
        const response = await specialEndpointService.getCategoryProductsSummaryByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('categoryId').that.is.a('number');
        expect(response).to.have.property('categoryName').that.is.a('string');
        expect(response).to.have.property('totalProducts').that.is.a('number');
        expect(response).to.have.property('activeProducts').that.is.a('number');
        expect(response).to.have.property('totalStock').that.is.a('number');
        expect(response).to.have.property('averagePrice').that.is.a('number');
        expect(response).to.have.property('priceRange').that.is.an('object');

        expect(response.totalProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.most(response.totalProducts);
        expect(response.totalStock).to.be.at.least(0);
        expect(response.averagePrice).to.be.at.least(0);

        expect(response.priceRange).to.have.property('min').that.is.a('number');
        expect(response.priceRange).to.have.property('max').that.is.a('number');
        expect(response.priceRange.min).to.be.at.least(0);
        expect(response.priceRange.max).to.be.at.least(response.priceRange.min);
    });

    it("Get User Order History By ID", async () => {
        const response = await specialEndpointService.getUserOrderHistoryByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('userId').that.is.a('number');
        expect(response).to.have.property('userName').that.is.a('string');
        expect(response).to.have.property('totalOrders').that.is.a('number');
        expect(response).to.have.property('orders').that.is.an('array');
        expect(response).to.have.property('totalSpent').that.is.a('number');
        expect(response).to.have.property('favoriteCategory');

        expect(response.totalOrders).to.be.at.least(0);
        expect(response.totalSpent).to.be.at.least(0);
        expect(response.orders.length).to.be.equal(response.totalOrders);

        if (response.orders.length > 0) {
            const firstOrder = response.orders[0];
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

        if (response.favoriteCategory !== null) {
            expect(response.favoriteCategory).to.be.a('string');
        }
    });

    it("Get Seller Dashboard By ID", async () => {
        const response = await specialEndpointService.getSellerDashboardByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('sellerId').that.is.a('number');
        expect(response).to.have.property('sellerName').that.is.a('string');
        expect(response).to.have.property('totalProducts').that.is.a('number');
        expect(response).to.have.property('activeProducts').that.is.a('number');
        expect(response).to.have.property('totalSales').that.is.a('number');
        expect(response).to.have.property('totalRevenue').that.is.a('number');
        expect(response).to.have.property('topSellingProducts').that.is.an('array');
        expect(response).to.have.property('productsByCategory').that.is.an('array');

        expect(response.totalProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.most(response.totalProducts);
        expect(response.totalSales).to.be.at.least(0);
        expect(response.totalRevenue).to.be.at.least(0);

        expect(response.topSellingProducts.length).to.be.at.most(5);

        if (response.topSellingProducts.length > 0) {
            const topProduct = response.topSellingProducts[0];
            expect(topProduct).to.be.an("object");
            expect(topProduct).to.have.property('productId').that.is.a('number');
            expect(topProduct).to.have.property('productName').that.is.a('string');
            expect(topProduct).to.have.property('salesCount').that.is.a('number');
            expect(topProduct).to.have.property('revenue').that.is.a('number');

            expect(topProduct.salesCount).to.be.at.least(0);
            expect(topProduct.revenue).to.be.at.least(0);
        }

        if (response.productsByCategory.length > 0) {
            const categoryItem = response.productsByCategory[0];
            expect(categoryItem).to.be.an("object");
            expect(categoryItem).to.have.property('categoryId').that.is.a('number');
            expect(categoryItem).to.have.property('categoryName').that.is.a('string');
            expect(categoryItem).to.have.property('productCount').that.is.a('number');

            expect(categoryItem.productCount).to.be.at.least(0);
        }
    });

    it("Get Category Subcategories By ID", async () => {
        const response = await specialEndpointService.getCategorySubcategoriesByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('categoryId').that.is.a('number');
        expect(response).to.have.property('categoryName').that.is.a('string');
        expect(response).to.have.property('parentId');
        expect(response).to.have.property('subcategories').that.is.an('array');
        expect(response).to.have.property('totalProducts').that.is.a('number');
        expect(response).to.have.property('depth').that.is.a('number');

        expect(response.totalProducts).to.be.at.least(0);
        expect(response.depth).to.be.at.least(0);

        if (response.subcategories.length > 0) {
            const subcategory = response.subcategories[0];
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('orderId').that.is.a('number');
        expect(response).to.have.property('user');
        expect(response).to.have.property('items').that.is.an('array');
        expect(response).to.have.property('totalAmount').that.is.a('number');
        expect(response).to.have.property('shippingAddress');
        expect(response).to.have.property('payment');
        expect(response).to.have.property('status').that.is.a('string');
        expect(response).to.have.property('createdAt');
        expect(response).to.have.property('modifiedAt');

        expect(response.totalAmount).to.be.at.least(0);

        if (response.user !== null) {
            expect(response.user).to.be.an("object");
            expect(response.user).to.have.property('id').that.is.a('number');
            expect(response.user).to.have.property('name').that.is.a('string');
            expect(response.user).to.have.property('email').that.is.a('string');
        }

        expect(response.items.length).to.be.at.least(0);

        if (response.items.length > 0) {
            const firstItem = response.items[0];
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

        if (response.shippingAddress !== null) {
            expect(response.shippingAddress).to.be.an("object");
        }

        if (response.payment !== null) {
            expect(response.payment).to.be.an("object");
        }

        expect(response.status).to.be.oneOf([
            "delivered", "cancelled", "returned", "failed", "pending", "processing", "shipped"
        ]);
    });

    it("Get Product Variants Summary By ID", async () => {
        const response = await specialEndpointService.getProductVariantsSummaryByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('productId').that.is.a('number');
        expect(response).to.have.property('productName').that.is.a('string');
        expect(response).to.have.property('totalVariants').that.is.a('number');
        expect(response).to.have.property('totalVariantStock').that.is.a('number');
        expect(response).to.have.property('availableVariants').that.is.a('number');
        expect(response).to.have.property('outOfStockVariants').that.is.a('number');
        expect(response).to.have.property('variantPriceRange').that.is.an('object');
        expect(response).to.have.property('colorDistribution').that.is.an('object');
        expect(response).to.have.property('sizeDistribution').that.is.an('object');
        expect(response).to.have.property('variants').that.is.an('array');

        expect(response.totalVariants).to.be.at.least(0);
        expect(response.totalVariantStock).to.be.at.least(0);
        expect(response.availableVariants).to.be.at.least(0);
        expect(response.outOfStockVariants).to.be.at.least(0);
        expect(response.availableVariants + response.outOfStockVariants).to.be.equal(response.totalVariants);

        expect(response.variantPriceRange).to.have.property('min').that.is.a('number');
        expect(response.variantPriceRange).to.have.property('max').that.is.a('number');
        expect(response.variantPriceRange.min).to.be.at.least(0);
        expect(response.variantPriceRange.max).to.be.at.least(response.variantPriceRange.min);

        expect(response.variants.length).to.be.equal(response.totalVariants);

        if (response.variants.length > 0) {
            const firstVariant = response.variants[0];
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('userId').that.is.a('number');
        expect(response).to.have.property('userName').that.is.a('string');
        expect(response).to.have.property('totalOrders').that.is.a('number');
        expect(response).to.have.property('totalSpent').that.is.a('number');
        expect(response).to.have.property('averageOrderValue').that.is.a('number');
        expect(response).to.have.property('mostPurchasedCategory');
        expect(response).to.have.property('mostPurchasedProduct');

        expect(response.totalOrders).to.be.at.least(0);
        expect(response.totalSpent).to.be.at.least(0);
        expect(response.averageOrderValue).to.be.at.least(0);

        if (response.totalOrders > 0) {
            const calculatedAverage = Number((response.totalSpent / response.totalOrders).toFixed(2));
            expect(response.averageOrderValue).to.be.equal(calculatedAverage);
        } else {
            expect(response.averageOrderValue).to.be.equal(0);
        }

        if (response.mostPurchasedCategory !== null) {
            expect(response.mostPurchasedCategory).to.be.an("object");
            expect(response.mostPurchasedCategory).to.have.property('categoryId').that.is.a('number');
            expect(response.mostPurchasedCategory).to.have.property('categoryName').that.is.a('string');
            expect(response.mostPurchasedCategory).to.have.property('totalQuantity').that.is.a('number');
            expect(response.mostPurchasedCategory.totalQuantity).to.be.at.least(0);
        }

        if (response.mostPurchasedProduct !== null) {
            expect(response.mostPurchasedProduct).to.be.an("object");
            expect(response.mostPurchasedProduct).to.have.property('productId').that.is.a('number');
            expect(response.mostPurchasedProduct).to.have.property('productName').that.is.a('string');
            expect(response.mostPurchasedProduct).to.have.property('totalQuantity').that.is.a('number');
            expect(response.mostPurchasedProduct.totalQuantity).to.be.at.least(0);
        }
    });

    it("Get Category Sales Stats By ID", async () => {
        const response = await specialEndpointService.getCategorySalesStatsByID();

        expect(response).to.be.an("object");
        expect(response).to.have.property('categoryId').that.is.a('number');
        expect(response).to.have.property('categoryName').that.is.a('string');
        expect(response).to.have.property('totalProducts').that.is.a('number');
        expect(response).to.have.property('totalSales').that.is.a('number');
        expect(response).to.have.property('totalRevenue').that.is.a('number');
        expect(response).to.have.property('averageOrderValue').that.is.a('number');
        expect(response).to.have.property('topSellingProducts').that.is.an('array');

        expect(response.totalProducts).to.be.at.least(0);
        expect(response.totalSales).to.be.at.least(0);
        expect(response.totalRevenue).to.be.at.least(0);
        expect(response.averageOrderValue).to.be.at.least(0);

        expect(response.topSellingProducts.length).to.be.at.most(5);

        if (response.topSellingProducts.length > 0) {
            const topProduct = response.topSellingProducts[0];
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('totalOrders').that.is.a('number');
        expect(response).to.have.property('limit').that.is.a('number');
        expect(response).to.have.property('offset').that.is.a('number');
        expect(response).to.have.property('orders').that.is.an('array');

        expect(response.totalOrders).to.be.at.least(0);
        expect(response.limit).to.be.equal(10);
        expect(response.offset).to.be.equal(0);
        expect(response.orders.length).to.be.at.most(response.limit);

        if (response.orders.length > 0) {
            const firstOrder = response.orders[0];
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('productId').that.is.a('number');
        expect(response).to.have.property('productName').that.is.a('string');
        expect(response).to.have.property('categoryId').that.is.a('number');
        expect(response).to.have.property('recommendations').that.is.an('array');
        expect(response).to.have.property('totalRecommendations').that.is.a('number');

        expect(response.totalRecommendations).to.be.at.least(0);
        expect(response.recommendations.length).to.be.at.most(5);
        expect(response.recommendations.length).to.be.equal(response.totalRecommendations);

        if (response.recommendations.length > 0) {
            const recommendation = response.recommendations[0];
            expect(recommendation).to.be.an("object");
            expect(recommendation).to.have.property('productId').that.is.a('number');
            expect(recommendation).to.have.property('productName').that.is.a('string');
            expect(recommendation).to.have.property('price').that.is.a('number');
            expect(recommendation).to.have.property('stock').that.is.a('number');
            expect(recommendation).to.have.property('status').that.is.a('string');
            expect(recommendation).to.have.property('tags').that.is.an('array');

            expect(recommendation.productId).to.not.be.equal(response.productId);
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('userId').that.is.a('number');
        expect(response).to.have.property('userName').that.is.a('string');
        expect(response).to.have.property('totalOrders').that.is.a('number');
        expect(response).to.have.property('totalSpent').that.is.a('number');
        expect(response).to.have.property('recentOrders').that.is.an('array');
        expect(response).to.have.property('topCategories').that.is.an('array');
        expect(response).to.have.property('lastActivity');
        expect(response).to.have.property('isActive').that.is.a('boolean');

        expect(response.totalOrders).to.be.at.least(0);
        expect(response.totalSpent).to.be.at.least(0);
        expect(response.recentOrders.length).to.be.at.most(5);
        expect(response.topCategories.length).to.be.at.most(3);

        if (response.recentOrders.length > 0) {
            const recentOrder = response.recentOrders[0];
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

        if (response.topCategories.length > 0) {
            const topCategory = response.topCategories[0];
            expect(topCategory).to.be.an("object");
            expect(topCategory).to.have.property('categoryId').that.is.a('number');
            expect(topCategory).to.have.property('categoryName').that.is.a('string');
            expect(topCategory).to.have.property('orderCount').that.is.a('number');

            expect(topCategory.orderCount).to.be.at.least(0);
        }

        expect(response.isActive).to.be.equal(response.totalOrders > 0);
    });

    it("Get Order Statistics", async () => {
        const response = await specialEndpointService.getOrderStatistics();

        expect(response).to.be.an("object");
        expect(response).to.have.property('totalOrders').that.is.a('number');
        expect(response).to.have.property('totalRevenue').that.is.a('number');
        expect(response).to.have.property('averageOrderValue').that.is.a('number');
        expect(response).to.have.property('totalItems').that.is.a('number');
        expect(response).to.have.property('highestOrder').that.is.a('number');
        expect(response).to.have.property('lowestOrder').that.is.a('number');
        expect(response).to.have.property('statusDistribution').that.is.an('object');
        expect(response).to.have.property('paymentMethodDistribution').that.is.an('object');

        expect(response.totalOrders).to.be.at.least(0);
        expect(response.totalRevenue).to.be.at.least(0);
        expect(response.averageOrderValue).to.be.at.least(0);
        expect(response.totalItems).to.be.at.least(0);
        expect(response.highestOrder).to.be.at.least(0);
        expect(response.lowestOrder).to.be.at.least(0);
        expect(response.lowestOrder).to.be.at.most(response.highestOrder);

        if (response.totalOrders > 0) {
            const calculatedAverage = Number((response.totalRevenue / response.totalOrders).toFixed(2));
            expect(response.averageOrderValue).to.be.equal(calculatedAverage);
        } else {
            expect(response.averageOrderValue).to.be.equal(0);
        }

        // Status distribution kontrolü
        const statusKeys = Object.keys(response.statusDistribution);
        if (statusKeys.length > 0) {
            statusKeys.forEach(status => {
                expect(response.statusDistribution[status]).to.be.a('number');
                expect(response.statusDistribution[status]).to.be.at.least(0);
            });
        }

        // Payment method distribution kontrolü
        const paymentKeys = Object.keys(response.paymentMethodDistribution);
        if (paymentKeys.length > 0) {
            paymentKeys.forEach(method => {
                expect(response.paymentMethodDistribution[method]).to.be.a('number');
                expect(response.paymentMethodDistribution[method]).to.be.at.least(0);
            });
        }
    });

    it("Get Category Trending Products By ID", async () => {
        const response = await specialEndpointService.getCategoryTrendingProductsByID(10);

        expect(response).to.be.an("object");
        expect(response).to.have.property('categoryId').that.is.a('number');
        expect(response).to.have.property('categoryName').that.is.a('string');
        expect(response).to.have.property('period').that.is.a('string');
        expect(response).to.have.property('trendingProducts').that.is.an('array');
        expect(response).to.have.property('totalTrendingProducts').that.is.a('number');

        expect(response.totalTrendingProducts).to.be.at.least(0);
        expect(response.trendingProducts.length).to.be.at.most(10);
        expect(response.trendingProducts.length).to.be.equal(response.totalTrendingProducts);

        if (response.trendingProducts.length > 0) {
            const trendingProduct = response.trendingProducts[0];
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

        expect(response).to.be.an("object");
        expect(response).to.have.property('sellerId').that.is.a('number');
        expect(response).to.have.property('sellerName').that.is.a('string');
        expect(response).to.have.property('totalProducts').that.is.a('number');
        expect(response).to.have.property('activeProducts').that.is.a('number');
        expect(response).to.have.property('totalSales').that.is.a('number');
        expect(response).to.have.property('totalRevenue').that.is.a('number');
        expect(response).to.have.property('averageProductPrice').that.is.a('number');
        expect(response).to.have.property('totalStock').that.is.a('number');
        expect(response).to.have.property('topCategory');
        expect(response).to.have.property('monthlyRevenue').that.is.an('object');

        expect(response.totalProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.least(0);
        expect(response.activeProducts).to.be.at.most(response.totalProducts);
        expect(response.totalSales).to.be.at.least(0);
        expect(response.totalRevenue).to.be.at.least(0);
        expect(response.averageProductPrice).to.be.at.least(0);
        expect(response.totalStock).to.be.at.least(0);

        if (response.topCategory !== null) {
            expect(response.topCategory).to.be.an("object");
            expect(response.topCategory).to.have.property('categoryId').that.is.a('number');
            expect(response.topCategory).to.have.property('categoryName').that.is.a('string');
            expect(response.topCategory).to.have.property('productCount').that.is.a('number');
            expect(response.topCategory.productCount).to.be.at.least(0);
        }

        // Monthly revenue kontrolü
        const monthlyKeys = Object.keys(response.monthlyRevenue);
        if (monthlyKeys.length > 0) {
            monthlyKeys.forEach(month => {
                expect(response.monthlyRevenue[month]).to.be.a('number');
                expect(response.monthlyRevenue[month]).to.be.at.least(0);
            });
        }
    });
});

