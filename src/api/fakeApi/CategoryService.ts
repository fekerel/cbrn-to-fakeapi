import addCategoryJSON from "@api/body/fakeApi/addCategory.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";

/**
 * Minimal helper to generate a reasonably unique category name for tests.
 */
function uniqueCategoryName(prefix = "Category") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

class CategoryService {
  /**
   * Create category from template + overrides. Returns created resource (res.data).
   */
  public async addCategory(categoryData: DeepPartial<typeof addCategoryJSON> = {}) {
    const body = merge({}, addCategoryJSON, categoryData);
    const res = await ApiService.getInstance().instance.post("/categories", body);
    return res.data;
  }

  /**
   * Create category with auto-generated name (caller can still override).
   */
  public async addCategoryRandom(categoryData: DeepPartial<typeof addCategoryJSON> = {}) {
    const defaults = { name: uniqueCategoryName(), status: "active" };
    const body = merge({}, addCategoryJSON, defaults, categoryData);
    const res = await ApiService.getInstance().instance.post("/categories", body);
    return res.data;
  }

  /**
   * Get a single category by id.
   */
  public async getCategory(id: number | string) {
    const res = await ApiService.getInstance().instance.get(`/categories/${id}`);
    return res.data;
  }

  /**
   * List categories with optional query params.
   */
  public async listCategories(params: Record<string, any> = {}) {
    const res = await ApiService.getInstance().instance.get("/categories", { params });
    return res.data;
  }

  /**
   * Update category by id. Returns updated resource.
   */
  public async updateCategory(id: number | string, patch: DeepPartial<typeof addCategoryJSON>) {
    const res = await ApiService.getInstance().instance.put(`/categories/${id}`, patch);
    return res.data;
  }

  /**
   * Delete category by id.
   */
  public async deleteCategory(id: number | string) {
    const res = await ApiService.getInstance().instance.delete(`/categories/${id}`);
    return res.status === 200 || res.status === 204;
  }
}

export const categoryService = new CategoryService();