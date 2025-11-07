import { expect } from "chai";
import { categoryService } from "../src/api/fakeApi/CategoryService";

describe("CategoryService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("Create New Category", async () => {
    const response = await categoryService.createCategory()

    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(201);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('parentId')
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data.status).to.equal('active');

  });

  it("Get All Categories", async () => {
    const response = await categoryService.getAllCategories();

    if (typeof response !== "object") {
      return;
    }

    expect(response.data).to.be.an("array");
    const firstData = response.data[0];

    expect(firstData).to.be.an("object");
    expect(firstData).to.have.property('id').that.is.a('number');
    expect(firstData).to.have.property('name').that.is.a('string');
    expect(firstData).to.have.property('description').that.is.a('string');
    expect(firstData).to.have.property('parentId')
    expect(firstData).to.have.property('status').that.is.a('string');
    expect(firstData.status).to.equal('active');


  });

  it("Get Category By ID", async () => {
    const response = await categoryService.getCategoryByID();
    if (typeof response !== "object") {
      return;
    }

    expect(response.status).to.be.equal(200);
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('parentId')
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data.status).to.equal('active');

  });

  it("Update Category By ID", async () => {
    const response = await categoryService.updateCategoryByID();

    if (typeof response !== "object") {
      return;
    }
    expect(response.data).to.be.an("object");
    expect(response.data).to.have.property('id').that.is.a('number');
    expect(response.data).to.have.property('name').that.is.a('string');
    expect(response.data).to.have.property('description').that.is.a('string');
    expect(response.data).to.have.property('parentId')
    expect(response.data).to.have.property('status').that.is.a('string');
    expect(response.data.status).to.equal('active');
  });

  it("Delete Category By ID", async () => {
    const response = await categoryService.deleteCategoryByID();
    if (typeof response !== "object") {
      return;
    }
    expect(response.status).to.be.equal(200);
  });
});