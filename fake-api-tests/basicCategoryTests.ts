import { expect } from "chai";
import { categoryService } from "../src/api/fakeApi/CategoryService";

describe("CategoryService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  it("Create New Category", async () => {
    const response = await categoryService.createCategory()
    expect(response).to.be.an("object");
    expect(response).to.have.property('id').that.is.a('number');
    expect(response).to.have.property('name').that.is.a('string');
    expect(response).to.have.property('description').that.is.a('string');
    expect(response).to.have.property('parentId')
    expect(response).to.have.property('status').that.is.a('string');
    expect(response.status).to.equal('active');

  });

  it("Get All Categories", async () => {
    const response = await categoryService.getAllCategories();

    expect(response).to.be.an("array");
    const firstData = response[0];

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

    expect(response).to.be.an("object");
    expect(response).to.have.property('id').that.is.a('number');
    expect(response).to.have.property('name').that.is.a('string');
    expect(response).to.have.property('description').that.is.a('string');
    expect(response).to.have.property('parentId')
    expect(response).to.have.property('status').that.is.a('string');
    expect(response.status).to.equal('active');

  });

  it("Update Category By ID", async () => {
    const response = await categoryService.updateCategoryByID();
    expect(response).to.be.an("object");
    expect(response).to.have.property('id').that.is.a('number');
    expect(response).to.have.property('name').that.is.a('string');
    expect(response).to.have.property('description').that.is.a('string');
    expect(response).to.have.property('parentId')
    expect(response).to.have.property('status').that.is.a('string');
    expect(response.status).to.equal('active');
  });

  it("Delete Category By ID", async () => {
    const response = await categoryService.deleteCategoryByID();
    expect(response).to.be.equal(200);
  });
});