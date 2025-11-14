import ApiService from "../ApiService";
import { randomPassword, buildRandomReviewBody } from "@/common/fakeApi/Utils";
import { AxiosResponse } from "axios";

class ReviewService {

    public async getAllReviews() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/reviews`);
        return response;
    }

    public async getReviewOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/reviews/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getRandomReview() {
        const reviews = (await this.getAllReviews()).data;
        if (!reviews || reviews.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * reviews.length);
        return reviews[randomIndex];
    }

    public async getReviewByID() {
        const review = await this.getRandomReview();
        if (!review) {
            return false;
        }
        const response = await ApiService.getInstance().instance.get(`/reviews/${review.id}`);
        if (response.data.id !== review.id || response.status !== 200) {
            return false;
        }
        return response;
    }

    public async updateReview() {
        const review = await this.getRandomReview();
        if (!review || !review.id) {
            return false;
        }
        const newRating = Math.floor(Math.random() * 5) + 1;
        const updateBody = {
            ...review,
            rating: newRating
        };
        const response = await ApiService.getInstance().instance.put(`/reviews/${review.id}`, updateBody);
        if (response.status !== 200)
            return false;
        const updatedReview = await this.getReviewOnlyByID(review.id);
        if (typeof updatedReview !== "object") {
            return false;
        }
        if (updatedReview.data.id === review.id && updatedReview.data.rating === newRating)
            return updatedReview;
        return false;
    }

    public async deleteReview() {
        const review = await this.getRandomReview();
        if (!review || !review.id) {
            return false;
        }
        const response = await ApiService.getInstance().instance.delete(`/reviews/${review.id}`);
        if (response.status !== 200)
            return false;
        const deletedReviewList = (await this.getAllReviews()).data;
        const isFalse = deletedReviewList.some((rev) => rev.id === review.id);
        if (isFalse)
            return false;
        return response
    }

    public async createNewReview() {
        // Get a user
        const usersResponse = await ApiService.getInstance().instance.get("/users");
        const users = usersResponse.data;
        if (!users || users.length === 0) {
            throw new Error("No users found");
        }
        const user = users[Math.floor(Math.random() * users.length)];

        // Get a product
        const productsResponse = await ApiService.getInstance().instance.get("/products");
        const products = productsResponse.data;
        if (!products || products.length === 0) {
            throw new Error("No products found");
        }
        const product = products[Math.floor(Math.random() * products.length)];

        const body = buildRandomReviewBody({
            productId: product.id,
            userId: user.id
        });

        const response = await ApiService.getInstance().instance.post("/reviews", JSON.parse(JSON.stringify(body)));
        if (response.status !== 201) {
            throw new Error(`Failed to create review. Status code: ${response.status}`);
        }
        return response
    }

    public async getReviewsAnalysis() {
        const response = await ApiService.getInstance().instance.get("/reviews/analysis");
        return response;
    }

    public async searchReviews() {
        const body = {
            rating: 5
        };
        const response = await ApiService.getInstance().instance.post("/reviews/search", body);
        return response;
    }
}

export const reviewService = new ReviewService();

