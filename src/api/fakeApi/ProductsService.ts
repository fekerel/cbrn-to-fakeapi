import { categoryService } from './CategoryService';
import { randomInt } from 'crypto';
import { userService } from './UserService';
import ConfigUtils from '@/common/ConfigUtils';
import { AxiosResponse } from 'axios';
import ApiService from '../ApiService';

class ProductService {

    public async createData() {
        const allCategoryList = await categoryService.getAllCategories();
        const allCategoryIdx = Array.from(new Set(allCategoryList.map((category) => category.id)))
        const categoryId = allCategoryIdx[randomInt(allCategoryIdx.length)]
        const allUsers = await userService.getAllUsers();
        const allUsersIdx = Array.from(new Set(allUsers.map((user) => user.id)))

        const sellerId = allUsersIdx[randomInt(allUsersIdx.length)]
        const name = ConfigUtils.generateUniqueWord();
        const description = ConfigUtils.generateUniqueWord3();
        const price = Number((Math.random() * 100).toFixed(2))
        const stock = randomInt(1000);
        const variant = []
        for (let i = 0; i < 2; i++) {
            const data = {
                id: ConfigUtils.generateUniqueWord3(),
                color: ["pink", "grey", "black", "red", "orange", "yellow"][randomInt(6)],
                size: ["XS", "S", "M", "L", "XL", "XXL"][randomInt(6)],
                price: Number((Math.random() * 100).toFixed(2)),
                stock: randomInt(1000)
            }
            variant.push(data)
        }
        const tags = []
        for (let i = 0; i < 2; i++) {
            tags.push(["featured", "bestseller", "popular", "limited", "exclusive", "premium", "recommended"][randomInt(7)])
        }
        const status = ["active", "inactive"][randomInt(2)]
        const addData = {
            id: null,
            sellerId: sellerId,
            categoryId: categoryId,
            name: name,
            description: description,
            price: price,
            stock: stock,
            variants: variant,
            tags: tags,
            status: status

        }
        return addData;
    }

    public async createNewProduct() {
        const data = await this.createData();
        const addData = JSON.parse(JSON.stringify(data));
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/products`, JSON.parse(JSON.stringify(addData)));
        return response;
    }

    public async getAllProducts() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products`);
        return response.data;
    }

    public async randomProduct() {
        const allProducts = await this.getAllProducts();
        return allProducts[Math.floor(Math.random() * allProducts.length)];

    }

    public async getProductByID() {
        const product = await this.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${product.id}`);
        const isTrue = response.data.id === product.id;
        if (isTrue)
            return response.data;
        return false;
    }

    public async getProductOnlyByID(id: number) {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/products/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response.data;
        return false;
    }


    public async updateProductByID() {
        const product = await this.randomProduct();
        const newName = await ConfigUtils.generateUniqueWord();
        product.name = newName;
        const response: AxiosResponse = await ApiService.getInstance().instance.put(`/products/${product.id}`, product);
        if (response.status !== 200 || typeof response.data !== "object")
            return false;
        const updatedData = await this.getProductOnlyByID(product.id);
        if (updatedData.id !== product.id || updatedData.name !== newName)
            return false;
        return response.data;


    }


    public async deleteProductByID() {
        const product = await this.randomProduct();
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/products/${product.id}`);
        if (response.status !== 200)
            return false;
        const allProducts = await this.getAllProducts();
        const isFalse = allProducts.some((p) => p.id === product.id);
        if (isFalse)
            return false;
        return response.status;


    }


}

export const productService = new ProductService();