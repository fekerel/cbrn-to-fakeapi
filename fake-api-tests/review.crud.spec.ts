import { expect } from "chai";
import { reviewService } from "../src/api/fakeApi/ReviewService";


describe("ReviewService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("GET /reviews/{id} - should return 200", async () => {
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
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data.rating).to.be.at.least(1);
    expect(response.data.rating).to.be.at.most(5);
  })


  it("GET /reviews - should return 200", async () => {
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
      expect(firstData).to.have.property('createdAt').that.is.a('number');
    }
  });

  it("POST /reviews - creates new review with id", async () => {
    const response = await reviewService.createNewReview();

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);

    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('productId').that.is.a('number');
    expect(response.data).to.have.property('userId').that.is.a('number');
    expect(response.data).to.have.property('rating').that.is.a('number');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data.rating).to.be.at.least(1);
    expect(response.data.rating).to.be.at.most(5);
  });

  it("DELETE /reviews/{id} - removes review (200)", async () => {
    const response = await reviewService.deleteReview();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  })

  it("PUT /reviews/{id} - updates review (200)", async () => {
    const response = await reviewService.updateReview();

    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('productId').that.is.a('number');
    expect(response.data).to.have.property('userId').that.is.a('number');
    expect(response.data).to.have.property('rating').that.is.a('number');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data.rating).to.be.at.least(1);
    expect(response.data.rating).to.be.at.most(5);
  })
});


