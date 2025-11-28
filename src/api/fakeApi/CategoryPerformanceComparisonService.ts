import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface CategoryPerformance {
    categoryId: number;
    categoryName: string;
    totalProducts: number;
    activeProducts: number;
    totalSales: number;
    totalRevenue: number;
    totalStock: number;
    averagePrice: number;
    averageOrderValue: number;
}

export interface CategoryPerformanceComparison {
    sortBy: string;
    totalCategories: number;
    comparison: CategoryPerformance[];
}

export type SortByOption = 'totalRevenue' | 'totalSales' | 'totalProducts' | 'averagePrice';

export interface PerformanceComparisonParams {
    limit?: number;
    sortBy?: SortByOption;
    sort_by?: SortByOption; // For FIELD_RENAME breaking change testing
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
 * CategoryPerformanceComparisonService - Service for testing GET /categories/performance-comparison endpoint
 * 
 * Breaking Changes:
 * - FIELD_RENAME: sortBy -> sort_by
 * - STATUS_CODE: 200 -> 226
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 */
class CategoryPerformanceComparisonService {

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
     * Get performance comparison with optional params
     */
    public async getPerformanceComparison(params?: PerformanceComparisonParams): Promise<AxiosResponse<CategoryPerformanceComparison>> {
        return this.api.get('/categories/performance-comparison', { params });
    }

    /**
     * Get performance comparison with default settings
     */
    public async getDefaultComparison(): Promise<ServiceResponse<CategoryPerformanceComparison>> {
        const response = await this.getPerformanceComparison();

        const data = response.data;
        const hasExpectedFields = 
            'sortBy' in data &&
            'totalCategories' in data &&
            'comparison' in data;

        return {
            response,
            isValidResponse: response.status === 200 && hasExpectedFields,
            expectedStatus: 200,
            expectedDataType: 'object',
            validationDetails: {
                hasExpectedFields,
                dataStructureValid: !('data' in data)
            }
        };
    }

    /**
     * Get comparison sorted by specific field (fails when FIELD_RENAME active)
     */
    public async getComparisonWithSortBy(sortBy: SortByOption): Promise<ServiceResponse<CategoryPerformanceComparison>> {
        const response = await this.getWithAnyStatus<CategoryPerformanceComparison>(
            '/categories/performance-comparison',
            { params: { sortBy } }
        );

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get comparison with limit
     */
    public async getComparisonWithLimit(limit: number): Promise<ServiceResponse<CategoryPerformanceComparison>> {
        const response = await this.getPerformanceComparison({ limit });

        return {
            response,
            isValidResponse: response.status === 200 && response.data.comparison.length <= limit,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get comparison expecting status 200 (fails when STATUS_CODE active)
     */
    public async getComparisonExpectingStatus200(): Promise<ServiceResponse<CategoryPerformanceComparison>> {
        const response = await this.getPerformanceComparison();

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get comparison expecting direct response (fails when RESPONSE_STRUCTURE active)
     */
    public async getComparisonExpectingDirectResponse(): Promise<ServiceResponse<CategoryPerformanceComparison>> {
        const response = await this.getPerformanceComparison();

        const data = response.data as any;
        const isDirectResponse = !('data' in data) && 'comparison' in data;

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
     * Raw request for custom testing
     */
    public async rawGetComparison(params?: PerformanceComparisonParams): Promise<AxiosResponse<any>> {
        return this.getWithAnyStatus('/categories/performance-comparison', { params });
    }
}

export const categoryPerformanceComparisonService = new CategoryPerformanceComparisonService();
