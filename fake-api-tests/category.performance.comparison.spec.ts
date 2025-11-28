import { categoryPerformanceComparisonService } from '@/api/fakeApi/CategoryPerformanceComparisonService';
import { expect } from 'chai';

describe('GET /categories/performance-comparison', () => {

    describe('Basic Functionality', () => {
        
        it('should return performance comparison with default settings', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('object');
        });

        it('should return all expected fields in response', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data).to.have.property('sortBy');
            expect(result.response.data).to.have.property('totalCategories');
            expect(result.response.data).to.have.property('comparison');
        });

        it('should return comparison as an array', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            
            expect(result.response.data.comparison).to.be.an('array');
        });

        it('should default sortBy to totalRevenue', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            
            expect(result.response.data.sortBy).to.equal('totalRevenue');
        });
    });

    describe('Sorting Functionality', () => {
        
        it('should sort by totalRevenue when specified', async () => {
            const result = await categoryPerformanceComparisonService.getComparisonWithSortBy('totalRevenue');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.sortBy).to.equal('totalRevenue');
            
            const comparison = result.response.data.comparison;
            if (comparison.length > 1) {
                for (let i = 0; i < comparison.length - 1; i++) {
                    expect(comparison[i].totalRevenue).to.be.at.least(comparison[i + 1].totalRevenue);
                }
            }
        });

        it('should sort by totalSales when specified', async () => {
            const result = await categoryPerformanceComparisonService.getComparisonWithSortBy('totalSales');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.sortBy).to.equal('totalSales');
            
            const comparison = result.response.data.comparison;
            if (comparison.length > 1) {
                for (let i = 0; i < comparison.length - 1; i++) {
                    expect(comparison[i].totalSales).to.be.at.least(comparison[i + 1].totalSales);
                }
            }
        });

        it('should sort by totalProducts when specified', async () => {
            const result = await categoryPerformanceComparisonService.getComparisonWithSortBy('totalProducts');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.sortBy).to.equal('totalProducts');
        });

        it('should sort by averagePrice when specified', async () => {
            const result = await categoryPerformanceComparisonService.getComparisonWithSortBy('averagePrice');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.sortBy).to.equal('averagePrice');
        });
    });

    describe('Limit Functionality', () => {
        
        it('should limit results when limit param provided', async () => {
            const limit = 3;
            const result = await categoryPerformanceComparisonService.getComparisonWithLimit(limit);
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.comparison.length).to.be.at.most(limit);
        });

        it('should return all categories when limit not provided', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.comparison.length).to.equal(result.response.data.totalCategories);
        });
    });

    describe('Comparison Item Validation', () => {
        
        it('should have valid structure for each category in comparison', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            const comparison = result.response.data.comparison;
            
            if (comparison.length > 0) {
                const firstCategory = comparison[0];
                expect(firstCategory).to.have.property('categoryId');
                expect(firstCategory).to.have.property('categoryName');
                expect(firstCategory).to.have.property('totalProducts');
                expect(firstCategory).to.have.property('activeProducts');
                expect(firstCategory).to.have.property('totalSales');
                expect(firstCategory).to.have.property('totalRevenue');
                expect(firstCategory).to.have.property('totalStock');
                expect(firstCategory).to.have.property('averagePrice');
                expect(firstCategory).to.have.property('averageOrderValue');
            }
        });

        it('should have numeric values for all stats fields', async () => {
            const result = await categoryPerformanceComparisonService.getDefaultComparison();
            const comparison = result.response.data.comparison;
            
            if (comparison.length > 0) {
                const firstCategory = comparison[0];
                expect(firstCategory.categoryId).to.be.a('number');
                expect(firstCategory.totalProducts).to.be.a('number');
                expect(firstCategory.activeProducts).to.be.a('number');
                expect(firstCategory.totalSales).to.be.a('number');
                expect(firstCategory.totalRevenue).to.be.a('number');
                expect(firstCategory.totalStock).to.be.a('number');
                expect(firstCategory.averagePrice).to.be.a('number');
                expect(firstCategory.averageOrderValue).to.be.a('number');
            }
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         */

        describe('FIELD_RENAME Breaking Change', () => {
            
            it('should accept sortBy parameter (fails when FIELD_RENAME active)', async () => {
                const result = await categoryPerformanceComparisonService.getComparisonWithSortBy('totalSales');
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status + 
                    '. Response: ' + JSON.stringify(result.response.data))
                    .to.equal(200);
                expect(result.response.data.sortBy).to.equal('totalSales');
            });

            it('should work with sortBy=totalRevenue (fails when FIELD_RENAME active)', async () => {
                const response = await categoryPerformanceComparisonService.rawGetComparison({ sortBy: 'totalRevenue' });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
            });

            it('should work with sortBy=averagePrice (fails when FIELD_RENAME active)', async () => {
                const response = await categoryPerformanceComparisonService.rawGetComparison({ sortBy: 'averagePrice' });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status)
                    .to.equal(200);
            });
        });

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for successful request (fails when STATUS_CODE active)', async () => {
                const result = await categoryPerformanceComparisonService.getComparisonExpectingStatus200();
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 with params (fails when STATUS_CODE active)', async () => {
                const response = await categoryPerformanceComparisonService.rawGetComparison({ limit: 5 });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status)
                    .to.equal(200);
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct object without wrapper (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categoryPerformanceComparisonService.getComparisonExpectingDirectResponse();
                
                expect(result.response.data, 
                    'Expected direct object but got: ' + JSON.stringify(result.response.data))
                    .to.have.property('comparison');
                expect(result.response.data,
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should have sortBy directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categoryPerformanceComparisonService.getDefaultComparison();
                
                expect(result.response.data, 'Expected direct access to sortBy')
                    .to.have.property('sortBy');
                expect(result.response.data.sortBy, 'sortBy should be a string')
                    .to.be.a('string');
            });

            it('should have totalCategories directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await categoryPerformanceComparisonService.getDefaultComparison();
                
                expect(result.response.data, 'Expected direct access to totalCategories')
                    .to.have.property('totalCategories');
                expect(result.response.data.totalCategories, 'totalCategories should be a number')
                    .to.be.a('number');
            });
        });
    });
});
