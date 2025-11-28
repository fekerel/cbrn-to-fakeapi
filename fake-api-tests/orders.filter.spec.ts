import { ordersFilterService } from '@/api/fakeApi/OrdersFilterService';
import { expect } from 'chai';

describe('GET /orders/filter', () => {

    describe('Basic Functionality - All Orders', () => {
        
        it('should return all orders when no filter provided', async () => {
            const result = await ordersFilterService.getAllOrdersFiltered();
            
            expect(result.response.status).to.equal(result.expectedStatus);
            expect(result.isValidResponse).to.be.true;
            expect(result.response.data.type).to.equal('all_orders');
        });

        it('should return expected fields for all_orders response', async () => {
            const result = await ordersFilterService.getAllOrdersFiltered();
            
            expect(result.response.data).to.have.property('type', 'all_orders');
            expect(result.response.data).to.have.property('totalOrders');
            expect(result.response.data).to.have.property('totalAmount');
            expect(result.response.data).to.have.property('orders');
            expect(result.response.data.orders).to.be.an('array');
        });
    });

    describe('Filter by orderId - Single Order', () => {
        
        it('should return single order when orderId provided', async () => {
            const order = await ordersFilterService.getRandomOrder();
            const result = await ordersFilterService.getOrderById(order.id);
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.type).to.equal('single_order');
            expect(result.response.data.order).to.have.property('id', order.id);
        });

        it('should return order details with all expected fields', async () => {
            const order = await ordersFilterService.getRandomOrder();
            const result = await ordersFilterService.getOrderById(order.id);
            
            expect(result.response.data.order).to.have.property('id');
            expect(result.response.data.order).to.have.property('userId');
            expect(result.response.data.order).to.have.property('userName');
            expect(result.response.data.order).to.have.property('totalAmount');
            expect(result.response.data.order).to.have.property('status');
            expect(result.response.data.order).to.have.property('items');
            expect(result.response.data.order).to.have.property('createdAt');
        });
    });

    describe('Filter by userId - User Orders', () => {
        
        it('should return user orders when userId provided', async () => {
            const user = await ordersFilterService.getRandomUser();
            const result = await ordersFilterService.getOrdersByUserId(user.id);
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.type).to.equal('user_orders');
            expect(result.response.data.userId).to.equal(user.id);
        });

        it('should return expected fields for user_orders response', async () => {
            const user = await ordersFilterService.getRandomUser();
            const result = await ordersFilterService.getOrdersByUserId(user.id);
            
            expect(result.response.data).to.have.property('userId');
            expect(result.response.data).to.have.property('userName');
            expect(result.response.data).to.have.property('totalOrders');
            expect(result.response.data).to.have.property('totalSpent');
            expect(result.response.data).to.have.property('orders');
        });
    });

    describe('Filter by status - Status Orders', () => {
        
        it('should return orders filtered by status', async () => {
            const result = await ordersFilterService.getOrdersByStatus('pending');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.type).to.equal('status_orders');
            expect(result.response.data.status).to.equal('pending');
        });

        it('should return expected fields for status_orders response', async () => {
            const result = await ordersFilterService.getOrdersByStatus('delivered');
            
            expect(result.response.data).to.have.property('status');
            expect(result.response.data).to.have.property('totalOrders');
            expect(result.response.data).to.have.property('totalAmount');
            expect(result.response.data).to.have.property('orders');
        });
    });

    describe('Filter by userId + status - User Status Orders', () => {
        
        it('should return user orders filtered by status', async () => {
            const user = await ordersFilterService.getRandomUser();
            const result = await ordersFilterService.getOrdersByUserIdAndStatus(user.id, 'pending');
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.type).to.equal('user_status_orders');
            expect(result.response.data.userId).to.equal(user.id);
            expect(result.response.data.status).to.equal('pending');
        });
    });

    describe('Filter by date range - Date Range Orders', () => {
        
        it('should return orders within date range', async () => {
            const now = Date.now();
            const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
            
            const result = await ordersFilterService.getOrdersByDateRange(oneMonthAgo, now);
            
            expect(result.response.status).to.equal(200);
            expect(result.response.data.type).to.equal('date_range_orders');
            expect(result.response.data.filters).to.have.property('startDate');
            expect(result.response.data.filters).to.have.property('endDate');
        });

        it('should return expected fields for date_range_orders response', async () => {
            const now = Date.now();
            const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
            
            const result = await ordersFilterService.getOrdersByDateRange(oneYearAgo, now);
            
            expect(result.response.data).to.have.property('filters');
            expect(result.response.data).to.have.property('totalOrders');
            expect(result.response.data).to.have.property('totalAmount');
            expect(result.response.data).to.have.property('orders');
        });
    });

    describe('Error Handling', () => {
        
        it('should return 400 for invalid orderId', async () => {
            const result = await ordersFilterService.getOrdersWithInvalidOrderId();
            
            expect(result.response.status).to.equal(400);
            expect(result.response.data).to.have.property('error');
        });

        it('should return 404 for non-existent orderId', async () => {
            const result = await ordersFilterService.getOrdersForNonExistentOrderId();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('error');
        });

        it('should return 404 for non-existent userId', async () => {
            const result = await ordersFilterService.getOrdersForNonExistentUserId();
            
            expect(result.response.status).to.equal(404);
            expect(result.response.data).to.have.property('error');
        });
    });

    describe('Breaking Change Sensitive Tests', () => {
        /**
         * These tests are designed to PASS when the server runs normally,
         * but FAIL when specific breaking changes are active.
         */

        describe('FIELD_RENAME Breaking Change', () => {
            
            it('should accept orderId parameter (fails when FIELD_RENAME active)', async () => {
                const order = await ordersFilterService.getRandomOrder();
                const response = await ordersFilterService.rawFilter({ orderId: order.id });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
                expect(response.data.type).to.equal('single_order');
            });

            it('should accept userId parameter (fails when FIELD_RENAME active)', async () => {
                const user = await ordersFilterService.getRandomUser();
                const response = await ordersFilterService.rawFilter({ userId: user.id });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
                expect(response.data.type).to.equal('user_orders');
            });

            it('should accept startDate parameter (fails when FIELD_RENAME active)', async () => {
                const now = Date.now();
                const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
                
                const response = await ordersFilterService.rawFilter({ startDate: oneYearAgo });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
                expect(response.data.type).to.equal('date_range_orders');
            });

            it('should accept endDate parameter (fails when FIELD_RENAME active)', async () => {
                const now = Date.now();
                
                const response = await ordersFilterService.rawFilter({ endDate: now });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status + 
                    '. Response: ' + JSON.stringify(response.data))
                    .to.equal(200);
                expect(response.data.type).to.equal('date_range_orders');
            });

            it('should accept combined userId and status (fails when FIELD_RENAME active for userId)', async () => {
                const user = await ordersFilterService.getRandomUser();
                const response = await ordersFilterService.rawFilter({ userId: user.id, status: 'pending' });
                
                expect(response.status,
                    'Expected status 200 but got ' + response.status)
                    .to.equal(200);
                expect(response.data.type).to.equal('user_status_orders');
            });
        });

        describe('STATUS_CODE Breaking Change', () => {
            
            it('should return status 200 for all orders (fails when STATUS_CODE active)', async () => {
                const result = await ordersFilterService.getOrdersExpectingStatus200();
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for single order (fails when STATUS_CODE active)', async () => {
                const order = await ordersFilterService.getRandomOrder();
                const result = await ordersFilterService.getOrderById(order.id);
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for user orders (fails when STATUS_CODE active)', async () => {
                const user = await ordersFilterService.getRandomUser();
                const result = await ordersFilterService.getOrdersByUserId(user.id);
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });

            it('should return status 200 for status filtered orders (fails when STATUS_CODE active)', async () => {
                const result = await ordersFilterService.getOrdersByStatus('pending');
                
                expect(result.response.status,
                    'Expected status 200 but got ' + result.response.status)
                    .to.equal(200);
            });
        });

        describe('RESPONSE_STRUCTURE Breaking Change', () => {
            
            it('should return direct object without wrapper (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await ordersFilterService.getOrdersExpectingDirectResponse();
                
                expect(result.response.data, 
                    'Expected direct object but got: ' + JSON.stringify(result.response.data))
                    .to.have.property('type');
                expect(result.response.data,
                    'Response should not be wrapped in { data: ... }')
                    .to.not.have.property('data');
            });

            it('should have type field directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await ordersFilterService.getAllOrdersFiltered();
                
                expect(result.response.data, 'Expected direct access to type')
                    .to.have.property('type');
                expect(result.response.data.type, 'type should be all_orders')
                    .to.equal('all_orders');
            });

            it('should have orders array directly accessible (fails when RESPONSE_STRUCTURE active)', async () => {
                const result = await ordersFilterService.getAllOrdersFiltered();
                
                expect(result.response.data, 'Expected direct access to orders')
                    .to.have.property('orders');
                expect(result.response.data.orders, 'orders should be an array')
                    .to.be.an('array');
            });

            it('should have order object directly accessible for single order (fails when RESPONSE_STRUCTURE active)', async () => {
                const order = await ordersFilterService.getRandomOrder();
                const result = await ordersFilterService.getOrderById(order.id);
                
                expect(result.response.data, 'Expected direct access to order')
                    .to.have.property('order');
                expect(result.response.data.order.id, 'order.id should match')
                    .to.equal(order.id);
            });
        });
    });
});
