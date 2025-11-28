import { productReviewsSummaryService } from '@/api/fakeApi/ProductReviewsSummaryService';
import { expect } from 'chai';

describe('GET /products/{id}/reviews-summary', () => {

    describe('Basic Functionality', () => {
        
        it('should return reviews summary for a valid product', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data).to.be.an('object');
        });

        it('should return all expected fields in response', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data).to.have.property('productId');
            expect(result.response.data).to.have.property('productName');
            expect(result.response.data).to.have.property('totalReviews');
            expect(result.response.data).to.have.property('averageRating');
            expect(result.response.data).to.have.property('ratingDistribution');
            expect(result.response.data).to.have.property('recentReviews');
        });

        it('should return recentReviews as an array', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            
            expect(result.response.data.recentReviews).to.be.an('array');
        });

        it('should return ratingDistribution as an object with keys 1-5', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            const distribution = result.response.data.ratingDistribution;
            
            expect(distribution).to.be.an('object');
            expect(distribution).to.have.property('1');
            expect(distribution).to.have.property('2');
            expect(distribution).to.have.property('3');
            expect(distribution).to.have.property('4');
            expect(distribution).to.have.property('5');
        });

        it('should return numeric values for stats fields', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            const data = result.response.data;
            
            expect(data.productId).to.be.a('number');
            expect(data.totalReviews).to.be.a('number');
            expect(data.averageRating).to.be.a('number');
        });

        it('should return averageRating between 0 and 5', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            
            expect(result.response.data.averageRating).to.be.at.least(0);
            expect(result.response.data.averageRating).to.be.at.most(5);
        });
    });

    describe('Recent Reviews Validation', () => {
        
        it('should return at most 5 recent reviews', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            
            expect(result.response.data.recentReviews.length).to.be.at.most(5);
        });

        it('should have valid structure for recent reviews', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            const recentReviews = result.response.data.recentReviews;
            
            if (recentReviews.length > 0) {
                const firstReview = recentReviews[0];
                expect(firstReview).to.have.property('reviewId');
                expect(firstReview).to.have.property('userId');
                expect(firstReview).to.have.property('userName');
                expect(firstReview).to.have.property('rating');
                expect(firstReview).to.have.property('createdAt');
            }
        });

        it('should have reviews sorted by createdAt descending (most recent first)', async () => {
            const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
            const recentReviews = result.response.data.recentReviews;
            
            if (recentReviews.length > 1) {
                for (let i = 0; i < recentReviews.length - 1; i++) {
                    expect(recentReviews[i].createdAt,
                        'Reviews should be sorted by createdAt descending')
                        .to.be.at.least(recentReviews[i + 1].createdAt);
                }
            }
        });
    });

    describe('Error Handling', () => {
        
        it('should return 400 for invalid product ID', async () => {
            const result = await productReviewsSummaryService.getReviewsSummaryWithInvalidId();
            
            expect(result.response.status).to.equal(400);
            expect(result.response.data).to.have.property('error');
        });

        it('should return 404 for non-existent product', async () => {
            const result = await productReviewsSummaryService.getReviewsSummaryForNonExistentProduct();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('error');
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         */

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for successful request (fails when STATUS_CODE active)', async () => {
                const result = await productReviewsSummaryService.getReviewsSummaryExpectingStatus200();
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for any valid product (fails when STATUS_CODE active)', async () => {
                const product = await productReviewsSummaryService.getRandomProduct();
                const response = await productReviewsSummaryService.rawGetReviewsSummary(product.id);
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct object without wrapper (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getReviewsSummaryExpectingDirectResponse();
                
                expect(result.response.data, 
                    'Expected direct object but got: ' + JSON.stringify(result.response.data))
                    .to.have.property('productId');
                expect(result.response.data,
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should have productName directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
                
                expect(result.response.data, 'Expected direct access to productName')
                    .to.have.property('productName');
                expect(result.response.data.productName, 'productName should be a string')
                    .to.be.a('string');
            });

            it('should have totalReviews directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
                
                expect(result.response.data, 'Expected direct access to totalReviews')
                    .to.have.property('totalReviews');
                expect(result.response.data.totalReviews, 'totalReviews should be a number')
                    .to.be.a('number');
            });

            it('should have averageRating directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
                
                expect(result.response.data, 'Expected direct access to averageRating')
                    .to.have.property('averageRating');
                expect(result.response.data.averageRating, 'averageRating should be a number')
                    .to.be.a('number');
            });

            it('should have ratingDistribution directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
                
                expect(result.response.data, 'Expected direct access to ratingDistribution')
                    .to.have.property('ratingDistribution');
                expect(result.response.data.ratingDistribution, 'ratingDistribution should be an object')
                    .to.be.an('object');
            });

            it('should have recentReviews directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await productReviewsSummaryService.getRandomProductReviewsSummary();
                
                expect(result.response.data, 'Expected direct access to recentReviews')
                    .to.have.property('recentReviews');
                expect(result.response.data.recentReviews, 'recentReviews should be an array')
                    .to.be.an('array');
            });
        });
    });
});
