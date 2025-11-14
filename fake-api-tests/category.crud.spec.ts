import { expect } from "chai";
import { categoryService } from "../src/api/fakeApi/CategoryService";


describe("CategoryService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("GET /categories/{id} - should return 200", async () => {
    const response = await categoryService.getCategoryByID();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
    if (response.data.parentId !== null && response.data.parentId !== undefined) {
      expect(response.data.parentId).to.be.a('number');
    }
  })


  it("GET /categories - should return 200", async () => {
    const response = await categoryService.getAllCategories();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("array");

    const firstData = response.data[0];
    expect(firstData).to.be.an("object");
    expect(firstData).to.have.property('id').that.is.a('number');
    expect(firstData).to.have.property('name').that.is.a('string');
    expect(firstData).to.have.property('description').that.is.a('string');
    expect(firstData).to.have.property('status').that.is.a('string');
    expect(firstData).to.have.property('createdAt').that.is.a('number');
    expect(firstData).to.have.property('modifiedAt').that.is.a('number');
  });

  it("POST /categories - creates new category with id", async () => {
    const response = await categoryService.createNewCategory();

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);

    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  });

  it("DELETE /categories/{id} - removes category (200)", async () => {
    const response = await categoryService.deleteCategory();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  })

  it("PUT /categories/{id} - updates category (200)", async () => {
    const response = await categoryService.updateCategory();

    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data).to.have.property('createdAt').that.is.a('number');
    expect(response.data).to.have.property('modifiedAt').that.is.a('number');
  })
});


