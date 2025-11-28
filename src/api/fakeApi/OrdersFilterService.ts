import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

// Response types based on filter scenario
export interface OrderItem {
    productId: number;
    variantId: string;
    quantity: number;
    price: number;
}

export interface Payment {
    method: 'credit_card' | 'paypal' | 'bank_transfer';
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrderDetail {
    id: number;
    userId: number;
    userName: string;
    totalAmount: number;
    status: OrderStatus;
    payment: Payment | null;
    items: OrderItem[];
    createdAt: number;
}

export type OrderStatus = 'pending' | 'failed' | 'cancelled' | 'returned' | 'delivered';

export interface SingleOrderResult {
    type: 'single_order';
    order: OrderDetail;
}

export interface UserOrdersResult {
    type: 'user_orders';
    userId: number;
    userName: string;
    totalOrders: number;
    totalSpent: number;
    orders: { id: number; totalAmount: number; status: OrderStatus; createdAt: number }[];
}

export interface StatusOrdersResult {
    type: 'status_orders';
    status: OrderStatus;
    totalOrders: number;
    totalAmount: number;
    orders: { id: number; userId: number; totalAmount: number; createdAt: number }[];
}

export interface UserStatusOrdersResult {
    type: 'user_status_orders';
    userId: number;
    userName: string;
    status: OrderStatus;
    totalOrders: number;
    totalAmount: number;
    orders: { id: number; totalAmount: number; createdAt: number }[];
}

export interface DateRangeOrdersResult {
    type: 'date_range_orders';
    filters: {
        userId: number | null;
        status: OrderStatus | null;
        startDate: number | null;
        endDate: number | null;
    };
    totalOrders: number;
    totalAmount: number;
    orders: { id: number; userId: number; totalAmount: number; status: OrderStatus; createdAt: number }[];
}

export interface AllOrdersResult {
    type: 'all_orders';
    totalOrders: number;
    totalAmount: number;
    orders: { id: number; userId: number; totalAmount: number; status: OrderStatus; createdAt: number }[];
}

export type OrderFilterResult = 
    | SingleOrderResult 
    | UserOrdersResult 
    | StatusOrdersResult 
    | UserStatusOrdersResult 
    | DateRangeOrdersResult 
    | AllOrdersResult;

export interface OrderFilterParams {
    orderId?: number;
    userId?: number;
    status?: OrderStatus;
    startDate?: number;
    endDate?: number;
    // For FIELD_RENAME breaking change testing
    order_id?: number;
    user_id?: number;
    start_date?: number;
    end_date?: number;
}

export interface Order {
    id: number;
    userId: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: number;
}

export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface ServiceResponse<T> {
    response: AxiosResponse<T>;
    isValidResponse: boolean;
    expectedStatus: number;
    expectedDataType: 'object' | 'wrapped-object';
    validationDetails?: {
        hasExpectedFields?: boolean;
        dataStructureValid?: boolean;
        responseType?: string;
    };
}

/**
 * OrdersFilterService - Service for testing GET /orders/filter endpoint
 * 
 * Breaking Changes:
 * - FIELD_RENAME: orderId -> order_id, userId -> user_id, startDate -> start_date, endDate -> end_date
 * - STATUS_CODE: 200 -> 206
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 */
class OrdersFilterService {

    private get api() {
        return ApiService.getInstance().instance;
    }

    /**
     * Helper method for requests expecting any status
     */
    private async getWithAnyStatus<T = any>(
        path: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.api.get<T>(path, {
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
     * Filter orders with params
     */
    public async filterOrders(params?: OrderFilterParams): Promise<AxiosResponse<OrderFilterResult>> {
        return this.api.get('/orders/filter', { params });
    }

    /**
     * Get all orders (no filter)
     */
    public async getAllOrdersFiltered(): Promise<ServiceResponse<AllOrdersResult>> {
        const response = await this.filterOrders();

        const data = response.data as any;
        const hasExpectedFields = data.type === 'all_orders' && 'totalOrders' in data && 'orders' in data;

        return {
            response: response as AxiosResponse<AllOrdersResult>,
            isValidResponse: response.status === 200 && hasExpectedFields,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields,
                dataStructureValid: !('data' in data),
                responseType: data.type
            }
        };
    }

    /**
     * Get single order by orderId (fails when FIELD_RENAME active)
     */
    public async getOrderById(orderId: number): Promise<ServiceResponse<SingleOrderResult>> {
        const response = await this.getWithAnyStatus<SingleOrderResult>('/orders/filter', {
            params: { orderId }
        });

        const data = response.data as any;
        const isValid = response.status === 200 && data.type === 'single_order';

        return {
            response,
            isValidResponse: isValid,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                responseType: data.type
            }
        };
    }

    /**
     * Get orders by userId (fails when FIELD_RENAME active)
     */
    public async getOrdersByUserId(userId: number): Promise<ServiceResponse<UserOrdersResult>> {
        const response = await this.getWithAnyStatus<UserOrdersResult>('/orders/filter', {
            params: { userId }
        });

        const data = response.data as any;
        const isValid = response.status === 200 && data.type === 'user_orders';

        return {
            response,
            isValidResponse: isValid,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                responseType: data.type
            }
        };
    }

    /**
     * Get orders by status
     */
    public async getOrdersByStatus(status: OrderStatus): Promise<ServiceResponse<StatusOrdersResult>> {
        const response = await this.filterOrders({ status });

        const data = response.data as any;
        const isValid = response.status === 200 && data.type === 'status_orders';

        return {
            response: response as AxiosResponse<StatusOrdersResult>,
            isValidResponse: isValid,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                responseType: data.type
            }
        };
    }

    /**
     * Get orders by userId and status (fails when FIELD_RENAME active for userId)
     */
    public async getOrdersByUserIdAndStatus(userId: number, status: OrderStatus): Promise<ServiceResponse<UserStatusOrdersResult>> {
        const response = await this.getWithAnyStatus<UserStatusOrdersResult>('/orders/filter', {
            params: { userId, status }
        });

        const data = response.data as any;
        const isValid = response.status === 200 && data.type === 'user_status_orders';

        return {
            response,
            isValidResponse: isValid,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                responseType: data.type
            }
        };
    }

    /**
     * Get orders by date range (fails when FIELD_RENAME active for startDate/endDate)
     */
    public async getOrdersByDateRange(startDate: number, endDate: number): Promise<ServiceResponse<DateRangeOrdersResult>> {
        const response = await this.getWithAnyStatus<DateRangeOrdersResult>('/orders/filter', {
            params: { startDate, endDate }
        });

        const data = response.data as any;
        const isValid = response.status === 200 && data.type === 'date_range_orders';

        return {
            response,
            isValidResponse: isValid,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                responseType: data.type
            }
        };
    }

    /**
     * Get orders expecting status 200 (fails when STATUS_CODE active)
     */
    public async getOrdersExpectingStatus200(): Promise<ServiceResponse<AllOrdersResult>> {
        const response = await this.filterOrders();

        return {
            response: response as AxiosResponse<AllOrdersResult>,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get orders expecting direct response (fails when RESPONSE_STRUCTURE active)
     */
    public async getOrdersExpectingDirectResponse(): Promise<ServiceResponse<AllOrdersResult>> {
        const response = await this.filterOrders();

        const data = response.data as any;
        const isDirectResponse = !('data' in data) && 'type' in data;

        return {
            response: response as AxiosResponse<AllOrdersResult>,
            isValidResponse: isDirectResponse,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                dataStructureValid: isDirectResponse
            }
        };
    }

    /**
     * Get orders with invalid orderId (should return 400)
     */
    public async getOrdersWithInvalidOrderId(): Promise<ServiceResponse<any>> {
        const response = await this.getWithAnyStatus('/orders/filter', {
            params: { orderId: 'invalid' }
        });

        return {
            response,
            isValidResponse: response.status === 400,
            expectedStatus: 400,
            expectedDataType: 'object'
        };
    }

    /**
     * Get orders for non-existent orderId (should return 404)
     */
    public async getOrdersForNonExistentOrderId(): Promise<ServiceResponse<any>> {
        const response = await this.getWithAnyStatus('/orders/filter', {
            params: { orderId: 999999 }
        });

        return {
            response,
            isValidResponse: response.status === 404,
            expectedStatus: 404,
            expectedDataType: 'object'
        };
    }

    /**
     * Get orders for non-existent userId (should return 404)
     */
    public async getOrdersForNonExistentUserId(): Promise<ServiceResponse<any>> {
        const response = await this.getWithAnyStatus('/orders/filter', {
            params: { userId: 999999 }
        });

        return {
            response,
            isValidResponse: response.status === 404,
            expectedStatus: 404,
            expectedDataType: 'object'
        };
    }

    /**
     * Raw request for custom testing
     */
    public async rawFilter(params?: OrderFilterParams): Promise<AxiosResponse<any>> {
        return this.getWithAnyStatus('/orders/filter', { params });
    }
}

export const ordersFilterService = new OrdersFilterService();
