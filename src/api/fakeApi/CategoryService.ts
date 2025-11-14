import { DeepPartial } from "@/common/fakeApi/Types";
import ApiService from "../ApiService";
import { randomPassword, buildRandomCategoryBody } from "@/common/fakeApi/Utils";
import { AxiosResponse } from "axios";
import { merge } from "lodash";
import addCategoryJSON from "@api/body/fakeApi/addCategory.json";

class CategoryService {

    public async addCategory(categoryData: DeepPartial<typeof addCategoryJSON> = {}) {
        const overrides = categoryData;
        const body = merge({}, addCategoryJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/categories", body);
        return res;
    }

    public async getAllCategories() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/categories`);
        return response;
    }

    public async getCategoryOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/categories/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getRandomCategory() {
        const categories = (await this.getAllCategories()).data;
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }

    public async getCategoryByID() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}`);
        if (response.data.id !== category.id || response.status !== 200) {
            return false;
        }
        return response;
    }

    public async updateCategory() {
        const category = await this.getRandomCategory();
        const newName = "UpdatedName" + randomPassword(5);
        category.name = newName;
        const response = await ApiService.getInstance().instance.put(`/categories/${category.id}`, category);
        if (response.status !== 200)
            return false;
        const updatedCategory = await this.getCategoryOnlyByID(category.id);
        if (typeof updatedCategory !== "object") {
            return false;
        }
        if (updatedCategory.data.id === category.id && updatedCategory.data.name === category.name)
            return updatedCategory;
        return false;
    }

    public async deleteCategory() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.delete(`/categories/${category.id}`, category);
        if (response.status !== 200)
            return false;
        const deletedCategoryList = (await this.getAllCategories()).data;
        const isFalse = deletedCategoryList.some((cat) => cat.id === category.id);
        if (isFalse)
            return false;
        return response
    }

    public async createNewCategory() {
        const body = buildRandomCategoryBody();

        const response = await ApiService.getInstance().instance.post("/categories", JSON.parse(JSON.stringify(body)));
        if (response.status !== 201) {
            throw new Error(`Failed to create category. Status code: ${response.status}`);
        }
        return response
    }

    public async getCategoryProductsSummary() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/products-summary`);
        return response;
    }

    public async getCategorySalesStats() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/sales-stats`);
        return response;
    }

    public async getCategorySubcategories() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/subcategories`);
        return response;
    }

    public async getCategoryTrendingProducts() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/trending-products`);
        return response;
    }

    public async getCategoryGrowthRate() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/growth-rate`);
        return response;
    }

    public async getCategoryMarketShare() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/market-share`);
        return response;
    }

    public async getCategoriesPerformanceComparison() {
        const response = await ApiService.getInstance().instance.get(`/categories/performance-comparison`);
        return response;
    }

    public async getStatisticsCategoryProduct() {
        const response = await ApiService.getInstance().instance.get(`/statistics/category-product`);
        return response;
    }

    public async getCategoryRevenueTrend() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/revenue-trend`);
        return response;
    }

    public async getCategoryReviewsStatistics() {
        const category = await this.getRandomCategory();
        const response = await ApiService.getInstance().instance.get(`/categories/${category.id}/reviews-statistics`);
        return response;
    }

    public async searchCategories() {
        const body = {
            query: "test",
            status: "active"
        };
        const response = await ApiService.getInstance().instance.post("/categories/search", body);
        return response;
    }
}

export const categoryService = new CategoryService();

