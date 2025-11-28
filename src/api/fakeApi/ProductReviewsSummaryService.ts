import ApiService from "../ApiService";
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface RecentReview {
    reviewId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string | null;
    createdAt: number;
}

export interface RatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

export interface ProductReviewsSummary {
    productId: number;
    productName: string;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: RatingDistribution;
    recentReviews: RecentReview[];
}

export interface Product {
    id: number;
    name: string;
    price?: number;
    categoryId?: number;
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
 * ProductReviewsSummaryService - Service for testing GET /products/{id}/reviews-summary endpoint
 * 
 * Breaking Changes:
 * - STATUS_CODE: 200 -> 210
 * - RESPONSE_STRUCTURE: direct data -> { data: ... }
 */
class ProductReviewsSummaryService {

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
     * Get all products from the API
     */
    public async getAllProducts(): Promise<AxiosResponse<Product[]>> {
        return this.api.get('/products');
    }

    /**
     * Get a random product from the API
     */
    public async getRandomProduct(): Promise<Product> {
        const response = await this.getAllProducts();
        const products = response.data;
        if (products.length === 0) {
            throw new Error('No products found in database');
        }
        return products[Math.floor(Math.random() * products.length)];
    }

    /**
     * Get reviews summary for a product
     */
    public async getReviewsSummary(productId: number): Promise<AxiosResponse<ProductReviewsSummary>> {
        return this.api.get(`/products/${productId}/reviews-summary`);
    }

    /**
     * Get reviews summary for a random product
     */
    public async getRandomProductReviewsSummary(): Promise<ServiceResponse<ProductReviewsSummary>> {
        const product = await this.getRandomProduct();
        const response = await this.getReviewsSummary(product.id);

        const data = response.data;
        const hasExpectedFields = 
            'productId' in data &&
            'productName' in data &&
            'totalReviews' in data &&
            'averageRating' in data &&
            'ratingDistribution' in data &&
            'recentReviews' in data;

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
     * Get reviews summary expecting status 200 (fails when STATUS_CODE active)
     */
    public async getReviewsSummaryExpectingStatus200(): Promise<ServiceResponse<ProductReviewsSummary>> {
        const product = await this.getRandomProduct();
        const response = await this.getReviewsSummary(product.id);

        return {
            response,
            isValidResponse: response.status === 200,
            expectedStatus: 200,
            expectedDataType: 'object'
        };
    }

    /**
     * Get reviews summary expecting direct response (fails when RESPONSE_STRUCTURE active)
     */
    public async getReviewsSummaryExpectingDirectResponse(): Promise<ServiceResponse<ProductReviewsSummary>> {
        const product = await this.getRandomProduct();
        const response = await this.getReviewsSummary(product.id);

        const data = response.data as any;
        const isDirectResponse = !('data' in data) && 'productId' in data;

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
     * Get reviews summary with invalid ID (should return 400)
     */
    public async getReviewsSummaryWithInvalidId(): Promise<ServiceResponse<any>> {
        const response = await this.getWithAnyStatus('/products/invalid/reviews-summary');

        return {
            response,
            isValidResponse: response.status === 400,
            expectedStatus: 400,
            expectedDataType: 'object'
        };
    }

    /**
     * Get reviews summary for non-existent product (should return 404)
     */
    public async getReviewsSummaryForNonExistentProduct(): Promise<ServiceResponse<any>> {
        const response = await this.getWithAnyStatus('/products/999999/reviews-summary');

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
    public async rawGetReviewsSummary(productId: number | string): Promise<AxiosResponse<any>> {
        return this.getWithAnyStatus(`/products/${productId}/reviews-summary`);
    }
}

export const productReviewsSummaryService = new ProductReviewsSummaryService();
