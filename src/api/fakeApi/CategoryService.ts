import ApiService from "../ApiService";
import { buildRandomCategoryBody } from "@common/fakeApi/Utils";

class CategoryService {
  private api = ApiService.getInstance().instance;

  public async createCategory(body?: any) {
    // POST /categories
    const payload = body ?? buildRandomCategoryBody();
    return this.api.post("/categories", payload);
  }

  public async getAllCategories() {
    // GET /categories
    return this.api.get("/categories");
  }

  public async getCategoryById(id: number) {
    // GET /categories/{id}
    return this.api.get(`/categories/${id}`);
  }

  public async updateCategoryById(id: number, body: any) {
    // PUT /categories/{id}
    const payload = body ?? buildRandomCategoryBody();
    return this.api.put(`/categories/${id}`, payload);
  }

  public async deleteCategoryById(id: number) {
    // DELETE /categories/{id}
    return this.api.delete(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();