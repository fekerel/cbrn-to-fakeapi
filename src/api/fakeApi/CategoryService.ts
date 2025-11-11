import ApiService from "../ApiService";

class CategoryService {
  // CRUD stubs only for experiment.

  public async createCategory(body?: any) {
    // AI: POST /categories
    throw new Error("NOT_IMPLEMENTED");
  }

  public async getAllCategories() {
    // AI: GET /categories
    throw new Error("NOT_IMPLEMENTED");
  }

  public async getCategoryById(id: number) {
    // AI: GET /categories/{id}
    throw new Error("NOT_IMPLEMENTED");
  }

  public async updateCategoryById(id: number, body: any) {
    // AI: PUT /categories/{id}
    throw new Error("NOT_IMPLEMENTED");
  }

  public async deleteCategoryById(id: number) {
    // AI: DELETE /categories/{id}
    throw new Error("NOT_IMPLEMENTED");
  }
}

export const categoryService = new CategoryService();