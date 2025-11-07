import ApiService from "../ApiService";
import ConfigUtils from "@/common/ConfigUtils";
import { randomInt } from "crypto";
import { userService } from "./UserService";
import { productService } from "./ProductsService";

class ReviewService {

    public async getRandomReview() {
        const allReviews = (await this.getAllReviews()).data;
        if (!allReviews || allReviews.length === 0) {
            return null;
        }
        return allReviews[Math.floor(Math.random() * allReviews.length)];
    }

    public async getReviewOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/reviews/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getReviewByID() {
        const review = await this.getRandomReview();
        if (!review) {
            return false;
        }
        const response = await ApiService.getInstance().instance.get(`/reviews/${review.id}`);
        if (typeof response.data !== "object")
            return false;
        const isTrue = response.data.id === review.id;
        if (isTrue)
            return response;
        return false;
    }

    public async updateReviewByID() {
        const review = await this.getRandomReview();
        if (!review) {
            return false;
        }
        const newComment = ConfigUtils.generateUniqueWord3() + " updated review";
        review.comment = newComment;
        const response = await ApiService.getInstance().instance.put(`/reviews/${review.id}`, review);
        if (typeof response.data !== "object" || response.status !== 200)
            return false;
        const updatedData = await this.getReviewOnlyByID(review.id);
        if (typeof updatedData !== "object") {
            return false;
        }
        if (updatedData.data.id !== review.id || updatedData.data.comment !== newComment)
            return false;
        return updatedData;
    }

    public async createReview() {
        const allUsers = (await userService.getAllUsers()).data;
        const allUsersIdx = Array.from(new Set(allUsers.map((user) => user.id)));
        const userId = allUsersIdx[randomInt(allUsersIdx.length)];

        const randomProduct = await productService.randomProduct();
        if (!randomProduct) {
            return false;
        }
        const productId = randomProduct.id;

        const rating = randomInt(5) + 1; // 1-5 arası rating
        const comment = ConfigUtils.generateUniqueWord3() + " review comment";
        const createdAt = Date.now();

        const body = {
            productId: productId,
            userId: userId,
            rating: rating,
            comment: comment,
            createdAt: createdAt
        };

        const response = await ApiService.getInstance().instance.post("/reviews", JSON.parse(JSON.stringify(body)));
        return response;
    }

    public async getAllReviews() {
        const response = await ApiService.getInstance().instance.get(`/reviews`);
        return response;
    }

    public async deleteReviewByID() {
        const review = await this.getRandomReview();
        if (!review) {
            return false;
        }
        const response = await ApiService.getInstance().instance.delete(`/reviews/${review.id}`);
        if (response.status !== 200)
            return false;
        const allReviews = (await this.getAllReviews()).data;
        const isFalse = allReviews.some((r) => r.id === review.id);
        if (isFalse)
            return false;
        return response;
    }

}

export const reviewService = new ReviewService();

