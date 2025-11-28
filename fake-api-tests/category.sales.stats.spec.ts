import { categorySalesStatsService } from '@/api/fakeApi/CategorySalesStatsService';
import { expect } from 'chai';

describe('GET /categories/{id}/sales-stats', () => {

    describe('Basic Functionality', () => {
        
        it('should return sales stats for a valid category', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('object');
        });

        it('should return all expected fields in response', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data).to.have.property('categoryId');
            expect(result.response.data).to.have.property('categoryName');
            expect(result.response.data).to.have.property('totalProducts');
            expect(result.response.data).to.have.property('totalSales');
            expect(result.response.data).to.have.property('totalRevenue');
            expect(result.response.data).to.have.property('averageOrderValue');
            expect(result.response.data).to.have.property('topSellingProducts');
        });

        it('should return topSellingProducts as an array', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.topSellingProducts).to.be.an('array');
        });

        it('should return numeric values for stats fields', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            const data = result.response.data;
            
            expect(data.categoryId).to.be.a('number');
            expect(data.totalProducts).to.be.a('number');
            expect(data.totalSales).to.be.a('number');
            expect(data.totalRevenue).to.be.a('number');
            expect(data.averageOrderValue).to.be.a('number');
        });
    });

    describe('Error Handling', () => {
        
        it('should return 400 for invalid category ID', async () => {
            const result = await categorySalesStatsService.getSalesStatsWithInvalidId();
            
            expect(result.response.status).to.equal(400);
            expect(result.response.data).to.have.property('error');
        });

        it('should return 404 for non-existent category', async () => {
            const result = await categorySalesStatsService.getSalesStatsForNonExistentCategory();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('error');
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         * This allows testing of "healing" capabilities.
         */

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for successful request (fails when STATUS_CODE active)', async () => {
                const result = await categorySalesStatsService.getSalesStatsExpectingStatus200();
                
                expect(result.response.status, 
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for any valid category (fails when STATUS_CODE active)', async () => {
                const category = await categorySalesStatsService.getRandomCategory();
                const response = await categorySalesStatsService.rawGetSalesStats(category.id);
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct object without wrapper (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categorySalesStatsService.getSalesStatsExpectingDirectResponse();
                
                expect(result.response.data, 
                    'Expected direct object but got: ' + JSON.stringify(result.response.data))
                    .to.have.property('categoryId');
                expect(result.response.data,
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should have categoryName directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categorySalesStatsService.getRandomCategorySalesStats();
                
                expect(result.response.data, 'Expected direct access to categoryName')
                    .to.have.property('categoryName');
                expect(result.response.data.categoryName, 'categoryName should be a string')
                    .to.be.a('string');
            });

            it('should have topSellingProducts directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categorySalesStatsService.getRandomCategorySalesStats();
                
                expect(result.response.data, 'Expected direct access to topSellingProducts')
                    .to.have.property('topSellingProducts');
                expect(result.response.data.topSellingProducts, 'topSellingProducts should be an array')
                    .to.be.an('array');
            });
        });
    });

    describe('Top Selling Products Validation', () => {
        
        it('should have valid structure for top selling products', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            const topProducts = result.response.data.topSellingProducts;
            
            if (topProducts.length > 0) {
                const firstProduct = topProducts[0];
                expect(firstProduct).to.have.property('productId');
                expect(firstProduct).to.have.property('productName');
                expect(firstProduct).to.have.property('salesCount');
                expect(firstProduct).to.have.property('revenue');
            }
        });

        it('should return at most 5 top selling products', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            
            expect(result.response.data.topSellingProducts.length).to.be.at.most(5);
        });

        it('should have products sorted by sales count descending', async () => {
            const result = await categorySalesStatsService.getRandomCategorySalesStats();
            const topProducts = result.response.data.topSellingProducts;
            
            if (topProducts.length > 1) {
                for (let i = 0; i < topProducts.length - 1; i++) {
                    expect(topProducts[i].salesCount,
                        'Products should be sorted by salesCount descending')
                        .to.be.at.least(topProducts[i + 1].salesCount);
                }
            }
        });
    });
});
