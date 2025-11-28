import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface TopSellingProduct {
    productId: number;
    productName: string;
    salesCount: number;
    revenue: number;
}

export interface CategorySalesStats {
    categoryId: number;
    categoryName: string;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingProducts: TopSellingProduct[];
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface ServiceResponse<T> {
    response: AxiosResponse<T>;
    isValidResponse: boolean;
    expectedStatus: number;
    expectedDataType: 'object' | 'wrapped-object';
    validationDetails?: {
        hasExpectedFields?: boolean;
        dataStructureValid?: boolean;
    };
}

/**
 * CategorySalesStatsService - Service for testing GET /categories/{id}/sales-stats endpoint
 * 
 * Breaking Changes:
 * - STATUS_CODE: 200 -> 218
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 */
class CategorySalesStatsService {

    private get api() {
        return ApiService.getInstance().instance;
    }

    /**
     * Helper method for requests expecting error responses
     * Prevents Axios from throwing on 4xx/5xx status codes
     */
    private async getExpectingError<T = any>(
        path: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.api.get<T>(path, {
            ...config,
            validateStatus: () => true
        });
    }

    /**
     * Get all categories from the API
     */
    public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
        return this.api.get('/categories');
    }

    /**
     * Get a random category from the API
     */
    public async getRandomCategory(): Promise<Category> {
        const response = await this.getAllCategories();
        const categories = response.data;
        if (categories.length === 0) {
            throw new Error('No categories found in database');
        }
        return categories[Math.floor(Math.random() * categories.length)];
    }

    /**
     * Get category sales stats by ID
     */
    public async getSalesStats(categoryId: number): Promise<AxiosResponse<CategorySalesStats>> {
        return this.api.get(`/categories/${categoryId}/sales-stats`);
    }

    /**
     * Get category sales stats for a random category
     */
    public async getRandomCategorySalesStats(): Promise<ServiceResponse<CategorySalesStats>> {
        const category = await this.getRandomCategory();
        const response = await this.getSalesStats(category.id);

        const data = response.data;
        const hasExpectedFields = 
            'categoryId' in data &&
            'categoryName' in data &&
            'totalProducts' in data &&
            'totalSales' in data &&
            'totalRevenue' in data &&
            'averageOrderValue' in data &&
            'topSellingProducts' in data;

        return {
            response,
            isValidResponse: response.status === 200 && hasExpectedFields,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields,
                dataStructureValid: !('data' in data) // Should NOT be wrapped
            }
        };
    }

    /**
     * Get sales stats expecting status 200 (fails when STATUS_CODE breaking change active)
     */
    public async getSalesStatsExpectingStatus200(): Promise<ServiceResponse<CategorySalesStats>> {
        const category = await this.getRandomCategory();
        const response = await this.getSalesStats(category.id);

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get sales stats expecting direct response (fails when RESPONSE_STRUCTURE breaking change active)
     */
    public async getSalesStatsExpectingDirectResponse(): Promise<ServiceResponse<CategorySalesStats>> {
        const category = await this.getRandomCategory();
        const response = await this.getSalesStats(category.id);

        const data = response.data as any;
        const isDirectResponse = !('data' in data) && 'categoryId' in data;

        return {
            response,
            isValidResponse: isDirectResponse,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                dataStructureValid: isDirectResponse
            }
        };
    }

    /**
     * Get sales stats with invalid ID (should return 400)
     */
    public async getSalesStatsWithInvalidId(): Promise<ServiceResponse<any>> {
        const response = await this.getExpectingError('/categories/invalid/sales-stats');

        return {
            response,
            isValidResponse: response.status === 400,
            expectedStatus: 400,
            expectedDataType: 'object'
        };
    }

    /**
     * Get sales stats for non-existent category (should return 404)
     */
    public async getSalesStatsForNonExistentCategory(): Promise<ServiceResponse<any>> {
        const response = await this.getExpectingError('/categories/999999/sales-stats');

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
    public async rawGetSalesStats(categoryId: number | string): Promise<AxiosResponse<any>> {
        return this.getExpectingError(`/categories/${categoryId}/sales-stats`);
    }
}

export const categorySalesStatsService = new CategorySalesStatsService();
