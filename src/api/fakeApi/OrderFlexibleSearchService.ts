import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export type OrderStatus = 'pending' | 'failed' | 'cancelled' | 'returned' | 'delivered';

export interface Order {
    id: number;
    userId: number;
    status: OrderStatus;
    totalAmount: number;
    items: any[];
    shippingAddress?: any;
    payment?: any;
    createdAt: number;
    modifiedAt?: number;
}

export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface OrderFlexibleSearchRequest {
    orderId?: number;
    userId?: number;
    status?: OrderStatus;
    totalAmountMin?: number;
    totalAmountMax?: number;
    dateFrom?: number;
    dateTo?: number;
    limit?: number;
    // For FIELD_RENAME breaking change testing
    order_id?: number;
    user_id?: number;
    total_amount_min?: number;
    total_amount_max?: number;
    date_from?: number;
    date_to?: number;
}

export interface ServiceResponse<T> {
    response: AxiosResponse<T>;
    isValidResponse: boolean;
    expectedStatus: number;
    expectedDataType: 'object' | 'array' | 'wrapped-object' | 'wrapped-array';
    validationDetails?: {
        hasExpectedFields?: boolean;
        dataStructureValid?: boolean;
    };
}

/**
 * OrderFlexibleSearchService - Service for testing POST /orders/flexible-search endpoint
 * 
 * Breaking Changes:
 * - FIELD_RENAME: orderId -> order_id, userId -> user_id, totalAmountMin -> total_amount_min, 
 *                 totalAmountMax -> total_amount_max, dateFrom -> date_from, dateTo -> date_to
 * - STATUS_CODE: 200 -> 202
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 * - REQUIRED_FIELD: limit field becomes required
 */
class OrderFlexibleSearchService {

    private get api() {
        return ApiService.getInstance().instance;
    }

    /**
     * Helper method for requests expecting any status
     */
    private async postWithAnyStatus<T = any>(
        path: string,
        data: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.api.post<T>(path, data, {
            ...config,
            validateStatus: () => true
        });
    }

    /**
     * Get all orders from the API
     */
    public async getAllOrders(): Promise<AxiosResponse<Order[]>> {
        return this.api.get('/orders');
    }

    /**
     * Get all users from the API
     */
    public async getAllUsers(): Promise<AxiosResponse<User[]>> {
        return this.api.get('/users');
    }

    /**
     * Get a random order from the API
     */
    public async getRandomOrder(): Promise<Order> {
        const response = await this.getAllOrders();
        const orders = response.data;
        if (orders.length === 0) {
            throw new Error('No orders found in database');
        }
        return orders[Math.floor(Math.random() * orders.length)];
    }

    /**
     * Get a random user from the API
     */
    public async getRandomUser(): Promise<User> {
        const response = await this.getAllUsers();
        const users = response.data;
        if (users.length === 0) {
            throw new Error('No users found in database');
        }
        return users[Math.floor(Math.random() * users.length)];
    }

    /**
     * Get multiple random orders
     */
    public async getRandomOrders(count: number): Promise<Order[]> {
        const response = await this.getAllOrders();
        const orders = response.data;
        const shuffled = [...orders].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, orders.length));
    }

    /**
     * Search orders with flexible params
     */
    public async flexibleSearch(params: OrderFlexibleSearchRequest): Promise<AxiosResponse<Order | Order[]>> {
        return this.api.post('/orders/flexible-search', params);
    }

    /**
     * Search by orderId - returns single object (fails when FIELD_RENAME active)
     */
    public async searchByOrderId(orderId: number): Promise<ServiceResponse<Order>> {
        const response = await this.postWithAnyStatus<Order>('/orders/flexible-search', { orderId });

        const data = response.data as any;
        const isSingleObject = !Array.isArray(data) && typeof data === 'object' && 'id' in data;

        return {
            response,
            isValidResponse: response.status === 200 && isSingleObject,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                dataStructureValid: !('data' in data)
            }
        };
    }

    /**
     * Search by userId - returns array (fails when FIELD_RENAME active)
     */
    public async searchByUserId(userId: number): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { userId });

        const data = response.data as any;
        const isArray = Array.isArray(data);

        return {
            response,
            isValidResponse: response.status === 200 && isArray,
            expectedStatus: 200,
            expectedDataType: 'array',
            validationDetails: {
                dataStructureValid: !('data' in data)
            }
        };
    }

    /**
     * Search by status - returns array
     */
    public async searchByStatus(status: OrderStatus): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { status });

        const data = response.data as any;
        const isArray = Array.isArray(data);

        return {
            response,
            isValidResponse: response.status === 200 && isArray,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search by userId and status (fails when FIELD_RENAME active for userId)
     */
    public async searchByUserIdAndStatus(userId: number, status: OrderStatus): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { userId, status });

        const data = response.data as any;
        const isArray = Array.isArray(data);

        return {
            response,
            isValidResponse: response.status === 200 && isArray,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search by amount range (fails when FIELD_RENAME active)
     */
    public async searchByAmountRange(totalAmountMin: number, totalAmountMax: number): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { 
            totalAmountMin, 
            totalAmountMax 
        });

        const data = response.data as any;
        const isArray = Array.isArray(data);

        return {
            response,
            isValidResponse: response.status === 200 && isArray,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search by date range (fails when FIELD_RENAME active)
     */
    public async searchByDateRange(dateFrom: number, dateTo: number): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { 
            dateFrom, 
            dateTo 
        });

        const data = response.data as any;
        const isArray = Array.isArray(data);

        return {
            response,
            isValidResponse: response.status === 200 && isArray,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search without limit field (fails when REQUIRED_FIELD active)
     */
    public async searchWithoutLimit(): Promise<ServiceResponse<Order[]>> {
        const order = await this.getRandomOrder();
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { 
            status: order.status 
        });

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search with no fields (should return 400)
     */
    public async searchWithNoFields(): Promise<ServiceResponse<any>> {
        const response = await this.postWithAnyStatus('/orders/flexible-search', {});

        return {
            response,
            isValidResponse: response.status === 400 && response.data?.code === 'MISSING_SEARCH_FIELDS',
            expectedStatus: 400,
            expectedDataType: 'object'
        };
    }

    /**
     * Search with invalid orderId type (should return 422)
     */
    public async searchWithInvalidOrderIdType(): Promise<ServiceResponse<any>> {
        const response = await this.postWithAnyStatus('/orders/flexible-search', { 
            orderId: 'invalid' 
        });

        return {
            response,
            isValidResponse: response.status === 422 && response.data?.code === 'INVALID_FIELD_TYPE',
            expectedStatus: 422,
            expectedDataType: 'object'
        };
    }

    /**
     * Search with invalid status value (should return 422)
     */
    public async searchWithInvalidStatus(): Promise<ServiceResponse<any>> {
        const response = await this.postWithAnyStatus('/orders/flexible-search', { 
            status: 'invalid_status' 
        });

        return {
            response,
            isValidResponse: response.status === 422 && response.data?.code === 'INVALID_STATUS_VALUE',
            expectedStatus: 422,
            expectedDataType: 'object'
        };
    }

    /**
     * Search with invalid amount range (min > max, should return 422)
     */
    public async searchWithInvalidAmountRange(): Promise<ServiceResponse<any>> {
        const response = await this.postWithAnyStatus('/orders/flexible-search', { 
            totalAmountMin: 500, 
            totalAmountMax: 100 
        });

        return {
            response,
            isValidResponse: response.status === 422 && response.data?.code === 'INVALID_RANGE',
            expectedStatus: 422,
            expectedDataType: 'object'
        };
    }

    /**
     * Search for non-existent orderId (should return 404)
     */
    public async searchNonExistentOrderId(): Promise<ServiceResponse<any>> {
        const response = await this.postWithAnyStatus('/orders/flexible-search', { 
            orderId: 999999 
        });

        return {
            response,
            isValidResponse: response.status === 404 && response.data?.code === 'NOT_FOUND',
            expectedStatus: 404,
            expectedDataType: 'object'
        };
    }

    /**
     * Get search expecting status 200 (fails when STATUS_CODE active)
     */
    public async searchExpectingStatus200(): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { 
            status: 'pending' 
        });

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search expecting direct response (fails when RESPONSE_STRUCTURE active)
     */
    public async searchExpectingDirectResponse(): Promise<ServiceResponse<Order[]>> {
        const response = await this.postWithAnyStatus<Order[]>('/orders/flexible-search', { 
            status: 'pending' 
        });

        const data = response.data as any;
        const isDirectResponse = Array.isArray(data) || (typeof data === 'object' && !('data' in data) && 'id' in data);

        return {
            response,
            isValidResponse: isDirectResponse,
            expectedStatus: 200,
            expectedDataType: 'array',
            validationDetails: {
                dataStructureValid: isDirectResponse
            }
        };
    }

    /**
     * Raw request for custom testing
     */
    public async rawSearch(params: OrderFlexibleSearchRequest): Promise<AxiosResponse<any>> {
        return this.postWithAnyStatus('/orders/flexible-search', params);
    }
}

export const orderFlexibleSearchService = new OrderFlexibleSearchService();
