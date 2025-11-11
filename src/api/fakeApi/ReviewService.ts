import ApiService from "../ApiService";

class ReviewService {
    // CRUD stubs only for experiment.

    public async createReview(body?: any) {
        // AI: POST /reviews
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getAllReviews() {
        // AI: GET /reviews
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getReviewById(id: number) {
        // AI: GET /reviews/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async updateReviewById(id: number, body: any) {
        // AI: PUT /reviews/{id}
        throw new Error("NOT_IMPLEMENTED");
    }

    public async deleteReviewById(id: number) {
        // AI: DELETE /reviews/{id}
        throw new Error("NOT_IMPLEMENTED");
    }
}

export const reviewService = new ReviewService();

