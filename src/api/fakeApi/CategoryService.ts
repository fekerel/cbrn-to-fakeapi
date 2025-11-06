import ApiService from "../ApiService";
import ConfigUtils from "@/common/ConfigUtils";
import { randomInt } from "crypto";

/**
 * Minimal helper to generate a reasonably unique category name for tests.
 */
function uniqueCategoryName(prefix = "Category") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

class CategoryService {

  public async deleteCategoryByID() {
    const category = await this.getRandomCategory();
    const response = await ApiService.getInstance().instance.delete(`/categories/${category.id}`);
    return response.status;
  }

  public async getCategoryOnlyByID(id: number) {
    const response = await ApiService.getInstance().instance.get(`/categories/${id}`);
    const isTrue = response.data.id === id;
    if (isTrue)
      return response.data;
    return false;
  }

  public async getCategoryByID() {
    const category = await this.getRandomCategory();
    const response = await ApiService.getInstance().instance.get(`/categories/${category.id}`);
    if (typeof response.data !== "object")
      return false;
    const isTrue = response.data.id === category.id;
    if (isTrue)
      return response.data;
    return false;
  }

  public async updateCategoryByID() {
    const category = await this.getRandomCategory();
    category.name = uniqueCategoryName(category.name);
    const response = await ApiService.getInstance().instance.put(`/categories/${category.id}`, category);
    if (typeof response.data !== "object" || response.status !== 200)
      return false;
    const isTrue = response.data.id === category.id && response.data.name === category.name;
    if (isTrue)
      return response.data;
    return false;
  }

  public async getRandomCategory() {
    const allCategories = await this.getAllCategories();
    return allCategories[Math.floor(Math.random() * allCategories.length)];
  }

  public async createCategory() {
    const marketCategories: string[] = [
      "Meyve & Sebze",
      "Et & Tavuk & Balık",
      "Süt & Kahvaltılık",
      "Atıştırmalık",
      "İçecek",
      "Temizlik Ürünleri",
      "Kişisel Bakım",
      "Ev & Mutfak"
    ];

    const name = marketCategories[randomInt(marketCategories.length)] + " " + ConfigUtils.generateUniqueWord2();
    const description = ConfigUtils.generateUniqueWord2() + " açıklaması";
    const parentId = null; // Ana kategori olarak oluşturulacak

    const body = {
      id: null,
      name: name,
      description: description,
      parentId: parentId,
      status: "active"
    };

    const response = await ApiService.getInstance().instance.post("/categories", JSON.parse(JSON.stringify(body)));
    return response.data;
  }

  public async getAllCategories() {
    const response = await ApiService.getInstance().instance.get(`/categories`);
    return response.data;
  }

}

export const categoryService = new CategoryService();