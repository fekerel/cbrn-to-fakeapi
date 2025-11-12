import ApiService from "../ApiService";
import { buildRandomReviewBody } from "@common/fakeApi/Utils";

class ReviewService {
    private api = ApiService.getInstance().instance;

    public async createReview(body?: any) {
        // POST /reviews
        const payload = body ?? buildRandomReviewBody();
        return this.api.post('/reviews', payload);
    }

    public async getAllReviews() {
        // GET /reviews
        return this.api.get('/reviews');
    }

    public async getReviewById(id: number) {
        // GET /reviews/{id}
        return this.api.get(`/reviews/${id}`);
    }

    public async updateReviewById(id: number, body: any) {
        // PUT /reviews/{id}
        const payload = body ?? buildRandomReviewBody();
        return this.api.put(`/reviews/${id}`, payload);
    }

    public async deleteReviewById(id: number) {
        // DELETE /reviews/{id}
        return this.api.delete(`/reviews/${id}`);
    }
}

export const reviewService = new ReviewService();

