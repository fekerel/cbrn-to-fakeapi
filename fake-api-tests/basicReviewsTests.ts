import { expect } from "chai";
import { reviewService } from "../src/api/fakeApi/ReviewService";

describe.only("ReviewService (fakeapi) - basic CRUD", function () {
    this.timeout(20000);

    it("Create New Review", async () => {
        const response = await reviewService.createReview();


        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(201);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('rating').that.is.a('number');
        expect(response.data.rating).to.be.at.least(1).and.at.most(5);
        expect(response.data).to.have.property('createdAt').that.is.a('number');
        // comment is nullable, so we check if it exists and is a string when present
        if (response.data.comment !== null && response.data.comment !== undefined) {
            expect(response.data.comment).to.be.a('string');
        }
    });

    it("Get All Reviews", async () => {
        const response = await reviewService.getAllReviews();

        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("array");

        if (response.data.length > 0) {
            const firstData = response.data[0];
            expect(firstData).to.be.an("object");
            expect(firstData).to.have.property('id').that.is.a('number');
            expect(firstData).to.have.property('productId').that.is.a('number');
            expect(firstData).to.have.property('userId').that.is.a('number');
            expect(firstData).to.have.property('rating').that.is.a('number');
            expect(firstData.rating).to.be.at.least(1).and.at.most(5);
            expect(firstData).to.have.property('createdAt').that.is.a('number');
            // comment is nullable
            if (firstData.comment !== null && firstData.comment !== undefined) {
                expect(firstData.comment).to.be.a('string');
            }
        }
    });

    it("Get Review By ID", async () => {
        const response = await reviewService.getReviewByID();
        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('rating').that.is.a('number');
        expect(response.data.rating).to.be.at.least(1).and.at.most(5);
        expect(response.data).to.have.property('createdAt').that.is.a('number');
        // comment is nullable
        if (response.data.comment !== null && response.data.comment !== undefined) {
            expect(response.data.comment).to.be.a('string');
        }
    });

    it("Update Review By ID", async () => {
        const response = await reviewService.updateReviewByID();

        if (typeof response !== "object") {
            return;
        }

        expect(response.status).to.be.equal(200);
        expect(response.data).to.be.an("object");
        expect(response.data).to.have.property('id').that.is.a('number');
        expect(response.data).to.have.property('productId').that.is.a('number');
        expect(response.data).to.have.property('userId').that.is.a('number');
        expect(response.data).to.have.property('rating').that.is.a('number');
        expect(response.data.rating).to.be.at.least(1).and.at.most(5);
        expect(response.data).to.have.property('createdAt').that.is.a('number');
        // comment is nullable
        if (response.data.comment !== null && response.data.comment !== undefined) {
            expect(response.data.comment).to.be.a('string');
        }
    });

    it("Delete Review By ID", async () => {
        const response = await reviewService.deleteReviewByID();
        if (typeof response !== "object") {
            return;
        }
        expect(response.status).to.be.equal(200);
    });
});

