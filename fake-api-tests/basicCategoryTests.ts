import { expect } from "chai";
import { categoryService } from "../src/api/fakeApi/CategoryService";
import ApiService from "../src/api/ApiService";

describe("CategoryService (fakeapi) - basic CRUD", function () {
  this.timeout(20000);

  let created: any = null;

  it("creates a category with auto name (addCategoryRandom)", async () => {
    created = await categoryService.addCategoryRandom({ description: "Initial desc" });
    expect(created).to.have.property("id");
    expect(created).to.have.property("name");
  });

  it("lists categories and finds the created one by name", async () => {
    const list = await categoryService.listCategories({ name: created.name });
    expect(Array.isArray(list)).to.be.true;
    const found = list.find((c: any) => c.id === created.id);
    expect(found).to.not.equal(undefined);
  });

  it("updates the category (updateCategory) and returns updated resource", async () => {
    const updated = await categoryService.updateCategory(created.id, { description: "Updated desc" });
    expect(updated).to.have.property("description", "Updated desc");
  });

  it("deletes the category (deleteCategory) and verifies removal", async () => {
    const ok = await categoryService.deleteCategory(created.id);
    expect(ok).to.be.true;
    const res = await ApiService.getInstance().instance.get(`/categories/${created.id}`, { validateStatus: null });
    expect(res.status).to.equal(404);
  });
});