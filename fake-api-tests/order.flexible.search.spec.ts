import { orderFlexibleSearchService } from '@/api/fakeApi/OrderFlexibleSearchService';
import { expect } from 'chai';

describe('POST /orders/flexible-search', () => {

    describe('Search by orderId - Single Order', () => {
        
        it('should return single order object when searching by orderId', async () => {
            const order = await orderFlexibleSearchService.getRandomOrder();
            const result = await orderFlexibleSearchService.searchByOrderId(order.id);
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data).to.be.an('object');
            expect(result.response.data).to.not.be.an('array');
            expect(result.response.data).to.have.property('id', order.id);
        });

        it('should return order with expected fields', async () => {
            const order = await orderFlexibleSearchService.getRandomOrder();
            const result = await orderFlexibleSearchService.searchByOrderId(order.id);
            
            expect(result.response.data).to.have.property('id');
            expect(result.response.data).to.have.property('userId');
            expect(result.response.data).to.have.property('status');
            expect(result.response.data).to.have.property('totalAmount');
        });
    });

    describe('Search by userId - User Orders Array', () => {
        
        it('should return array of orders when searching by userId', async () => {
            const user = await orderFlexibleSearchService.getRandomUser();
            const result = await orderFlexibleSearchService.searchByUserId(user.id);
            
            // May return 200 with array or 404 if user has no orders
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
            } else {
                expect(result.response.status).to.equal(404);
            }
        });
    });

    describe('Search by status - Status Orders Array', () => {
        
        it('should return array of orders when searching by status', async () => {
            const result = await orderFlexibleSearchService.searchByStatus('pending');
            
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
                result.response.data.forEach((order: any) => {
                    expect(order.status.toLowerCase()).to.equal('pending');
                });
            } else {
                expect(result.response.status).to.equal(404);
            }
        });

        it('should filter by delivered status', async () => {
            const result = await orderFlexibleSearchService.searchByStatus('delivered');
            
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
            }
        });
    });

    describe('Search by userId + status', () => {
        
        it('should return array of orders matching both userId and status', async () => {
            const user = await orderFlexibleSearchService.getRandomUser();
            const result = await orderFlexibleSearchService.searchByUserIdAndStatus(user.id, 'pending');
            
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
            } else {
                expect(result.response.status).to.equal(404);
            }
        });
    });

    describe('Search by amount range', () => {
        
        it('should return orders within amount range', async () => {
            const result = await orderFlexibleSearchService.searchByAmountRange(10, 1000);
            
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
                result.response.data.forEach((order: any) => {
                    const amount = parseFloat(order.totalAmount);
                    expect(amount).to.be.at.least(10);
                    expect(amount).to.be.at.most(1000);
                });
            }
        });
    });

    describe('Search by date range', () => {
        
        it('should return orders within date range', async () => {
            const now = Date.now();
            const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
            
            const result = await orderFlexibleSearchService.searchByDateRange(oneYearAgo, now);
            
            if (result.response.status === 200) {
                expect(result.response.data).to.be.an('array');
            }
        });
    });

    describe('Error Handling', () => {
        
        it('should return 400 when no search fields provided', async () => {
            const result = await orderFlexibleSearchService.searchWithNoFields();
            
            expect(result.response.status).to.equal(400);
            expect(result.response.data).to.have.property('code', 'MISSING_SEARCH_FIELDS');
        });

        it('should return 422 for invalid orderId type', async () => {
            const result = await orderFlexibleSearchService.searchWithInvalidOrderIdType();
            
            expect(result.response.status).to.equal(422);
            expect(result.response.data).to.have.property('code', 'INVALID_FIELD_TYPE');
        });

        it('should return 422 for invalid status value', async () => {
            const result = await orderFlexibleSearchService.searchWithInvalidStatus();
            
            expect(result.response.status).to.equal(422);
            expect(result.response.data).to.have.property('code', 'INVALID_STATUS_VALUE');
        });

        it('should return 422 for invalid amount range (min > max)', async () => {
            const result = await orderFlexibleSearchService.searchWithInvalidAmountRange();
            
            expect(result.response.status).to.equal(422);
            expect(result.response.data).to.have.property('code', 'INVALID_RANGE');
        });

        it('should return 404 for non-existent orderId', async () => {
            const result = await orderFlexibleSearchService.searchNonExistentOrderId();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('code', 'NOT_FOUND');
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         */

        describe('FIELD_RENAME Breaking Change', () => {
            
            it('should accept orderId field (fails when FIELD_RENAME active)', async () => {
                const order = await orderFlexibleSearchService.getRandomOrder();
                const response = await orderFlexibleSearchService.rawSearch({ orderId: order.id });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
                expect(response.data).to.have.property('id', order.id);
            });

            it('should accept userId field (fails when FIELD_RENAME active)', async () => {
                const user = await orderFlexibleSearchService.getRandomUser();
                const response = await orderFlexibleSearchService.rawSearch({ userId: user.id });
                
                // May be 200 or 404 depending on data, but should not be 400
                expect(response.status,
                    'Expected status 200 or 404 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });

            it('should accept totalAmountMin field (fails when FIELD_RENAME active)', async () => {
                const response = await orderFlexibleSearchService.rawSearch({ totalAmountMin: 1 });
                
                expect(response.status,
                    'Expected status 200 or 404 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });

            it('should accept totalAmountMax field (fails when FIELD_RENAME active)', async () => {
                const response = await orderFlexibleSearchService.rawSearch({ totalAmountMax: 10000 });
                
                expect(response.status,
                    'Expected status 200 or 404 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });

            it('should accept dateFrom field (fails when FIELD_RENAME active)', async () => {
                const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
                const response = await orderFlexibleSearchService.rawSearch({ dateFrom: oneYearAgo });
                
                expect(response.status,
                    'Expected status 200 or 404 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });

            it('should accept dateTo field (fails when FIELD_RENAME active)', async () => {
                const response = await orderFlexibleSearchService.rawSearch({ dateTo: Date.now() });
                
                expect(response.status,
                    'Expected status 200 or 404 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });
        });

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for successful search (fails when STATUS_CODE active)', async () => {
                const order = await orderFlexibleSearchService.getRandomOrder();
                const result = await orderFlexibleSearchService.searchByOrderId(order.id);
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for status search (fails when STATUS_CODE active)', async () => {
                const result = await orderFlexibleSearchService.searchExpectingStatus200();
                
                // May be 200 or 404 but definitely not 202
                if (result.response.status !== 404) {
                    expect(result.response.status,
                        'Expected status 200 but got ' + result.response.status)
                        .to.equal(200);
                }
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct object for orderId search (fails when RESPONSE_STRUCTURE active)', async () => {
                const order = await orderFlexibleSearchService.getRandomOrder();
                const result = await orderFlexibleSearchService.searchByOrderId(order.id);
                
                expect(result.response.data, 'Expected direct object with id')
                    .to.have.property('id');
                expect(result.response.data,
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should return direct array for status search (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await orderFlexibleSearchService.searchExpectingDirectResponse();
                
                if (result.response.status === 200) {
                    expect(result.response.data, 
                        'Expected direct array but got: ' + JSON.stringify(result.response.data))
                        .to.be.an('array');
                }
            });

            it('should have order fields directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const order = await orderFlexibleSearchService.getRandomOrder();
                const result = await orderFlexibleSearchService.searchByOrderId(order.id);
                
                expect(result.response.data, 'Expected direct access to userId')
                    .to.have.property('userId');
                expect(result.response.data, 'Expected direct access to status')
                    .to.have.property('status');
            });
        });

        describe('REQUIRED_FIELD Breaking Change', () => {
            
            it('should work without limit field (fails when REQUIRED_FIELD active)', async () => {
                const result = await orderFlexibleSearchService.searchWithoutLimit();
                
                expect(result.response.status,
                    'Expected status 200 or 404 but got ' + result.response.status + 
                    '. Response: ' + JSON.stringify(result.response.data))
                    .to.be.oneOf([200, 404]);
            });

            it('should search by orderId without limit (fails when REQUIRED_FIELD active)', async () => {
                const order = await orderFlexibleSearchService.getRandomOrder();
                const response = await orderFlexibleSearchService.rawSearch({ orderId: order.id });
                
                expect(response.status,
                    'Request should not fail with 400. Response: ' + JSON.stringify(response.data))
                    .to.not.equal(400);
            });

            it('should search by status without limit (fails when REQUIRED_FIELD active)', async () => {
                const response = await orderFlexibleSearchService.rawSearch({ status: 'pending' });
                
                // Should be 200 or 404, not 400 for missing limit
                expect(response.status,
                    'Request should not require limit field. Response: ' + JSON.stringify(response.data))
                    .to.be.oneOf([200, 404]);
            });
        });
    });
});
