import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    address: {
        street: string;
        city: string;
        country: string;
        zipCode: string;
    };
    phone: string;
    status: string;
    createdAt: number;
    modifiedAt: number;
}

export interface FlexibleSearchRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    limit?: number;
    first_name?: string;
    last_name?: string;
}

export interface ServiceResponse<T> {
    response: AxiosResponse<T>;
    isValidResponse: boolean;
    expectedStatus: number;
    expectedDataType: 'array' | 'object' | 'wrapped-array' | 'wrapped-object';
    validationDetails?: {
        hasExpectedFields?: boolean;
        matchesSearchCriteria?: boolean;
        dataStructureValid?: boolean;
    };
}

/**
 * UserFlexibleSearchService - Service for testing POST /users/flexible-search endpoint
 * 
 * Breaking Changes:
 * - FIELD_RENAME: firstName -> first_name, lastName -> last_name
 * - STATUS_CODE: 200 -> 250
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 * - REQUIRED_FIELD: limit field becomes required
 */
class UserFlexibleSearchService {

    private get api() {
        return ApiService.getInstance().instance;
    }

    /**
     * Helper method for requests expecting error responses
     * Prevents Axios from throwing on 4xx/5xx status codes
     */
    private async postExpectingError<T = any>(
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
     * Get all users from the API
     */
    public async getAllUsers(): Promise<AxiosResponse<User[]>> {
        return this.api.get('/users');
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
     * Get multiple random users from the API
     */
    public async getRandomUsers(count: number): Promise<User[]> {
        const response = await this.getAllUsers();
        const users = response.data;
        const shuffled = [...users].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, users.length));
    }

    /**
     * Search by email (unique identifier - returns single user object)
     */
    public async searchByEmail(): Promise<ServiceResponse<User>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User>(
            '/users/flexible-search',
            { email: user.email }
        );

        return {
            response,
            isValidResponse: response.status === 200 && 
                             response.data && 
                             typeof response.data === 'object' && 
                             !Array.isArray(response.data),
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields: response.data?.email === user.email,
                matchesSearchCriteria: true,
                dataStructureValid: !Array.isArray(response.data)
            }
        };
    }

    /**
     * Search by phone (unique identifier - returns single user object)
     */
    public async searchByPhone(): Promise<ServiceResponse<User>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User>(
            '/users/flexible-search',
            { phone: user.phone }
        );

        return {
            response,
            isValidResponse: response.status === 200 && 
                             response.data && 
                             typeof response.data === 'object' && 
                             !Array.isArray(response.data),
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields: response.data?.phone === user.phone,
                matchesSearchCriteria: true,
                dataStructureValid: !Array.isArray(response.data)
            }
        };
    }

    /**
     * Search by firstName only (returns array of matching users)
     */
    public async searchByFirstName(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName }
        );

        return {
            response,
            isValidResponse: response.status === 200 && Array.isArray(response.data),
            expectedStatus: 200,
            expectedDataType: 'array',
            validationDetails: {
                matchesSearchCriteria: Array.isArray(response.data) && 
                    response.data.every((u: User) => 
                        u.firstName?.toLowerCase().includes(user.firstName.toLowerCase())
                    ),
                dataStructureValid: Array.isArray(response.data)
            }
        };
    }

    /**
     * Search by firstName and lastName (returns array of matching users)
     */
    public async searchByFullName(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName, lastName: user.lastName }
        );

        return {
            response,
            isValidResponse: response.status === 200 && Array.isArray(response.data),
            expectedStatus: 200,
            expectedDataType: 'array',
            validationDetails: {
                matchesSearchCriteria: Array.isArray(response.data) && 
                    response.data.every((u: User) => 
                        u.firstName?.toLowerCase().includes(user.firstName.toLowerCase()) &&
                        u.lastName?.toLowerCase().includes(user.lastName.toLowerCase())
                    ),
                dataStructureValid: Array.isArray(response.data)
            }
        };
    }

    /**
     * Search with no fields (should return 400 error)
     */
    public async searchWithNoFields(): Promise<ServiceResponse<any>> {
        const response = await this.postExpectingError(
            '/users/flexible-search',
            {}
        );

        return {
            response,
            isValidResponse: response.status === 400 && 
                             response.data?.code === 'MISSING_SEARCH_FIELDS',
            expectedStatus: 400,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields: response.data?.error !== undefined,
                dataStructureValid: true
            }
        };
    }

    /**
     * Search with invalid email format (should return 422 error)
     */
    public async searchWithInvalidEmail(): Promise<ServiceResponse<any>> {
        const response = await this.postExpectingError(
            '/users/flexible-search',
            { email: 'not-an-email' }
        );

        return {
            response,
            isValidResponse: response.status === 422 && 
                             response.data?.code === 'INVALID_EMAIL_FORMAT',
            expectedStatus: 422,
            expectedDataType: 'object'
        };
    }

    /**
     * Search for non-existent user (should return 404)
     */
    public async searchNonExistentUser(): Promise<ServiceResponse<any>> {
        const response = await this.postExpectingError(
            '/users/flexible-search',
            { email: 'definitely-not-exists-12345@example.com' }
        );

        return {
            response,
            isValidResponse: response.status === 404 && 
                             response.data?.code === 'NOT_FOUND',
            expectedStatus: 404,
            expectedDataType: 'object'
        };
    }

    /**
     * Search using old field name (firstName) when FIELD_RENAME is active
     * This test is designed to FAIL when breaking changes are active
     */
    public async searchWithOldFieldName(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName }
        );

        return {
            response,
            isValidResponse: response.status === 200 && Array.isArray(response.data),
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search expecting direct array response (not wrapped)
     * This test is designed to FAIL when RESPONSE_STRUCTURE breaking change is active
     */
    public async searchExpectingDirectResponse(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName }
        );

        const isDirectArray = Array.isArray(response.data);
        
        return {
            response,
            isValidResponse: response.status === 200 && isDirectArray,
            expectedStatus: 200,
            expectedDataType: 'array',
            validationDetails: {
                dataStructureValid: isDirectArray && !('data' in response.data)
            }
        };
    }

    /**
     * Search expecting status 200
     * This test is designed to FAIL when STATUS_CODE breaking change is active
     */
    public async searchExpectingStatus200(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName }
        );

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Search without required 'limit' field
     * This test is designed to FAIL when REQUIRED_FIELD breaking change is active
     */
    public async searchWithoutLimit(): Promise<ServiceResponse<User[]>> {
        const user = await this.getRandomUser();
        
        const response = await this.api.post<User[]>(
            '/users/flexible-search',
            { firstName: user.firstName }
        );

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'array'
        };
    }

    /**
     * Send a raw flexible search request
     */
    public async rawSearch(body: FlexibleSearchRequest): Promise<AxiosResponse> {
        return this.api.post(
            '/users/flexible-search',
            body
        );
    }
}

export const userFlexibleSearchService = new UserFlexibleSearchService();
