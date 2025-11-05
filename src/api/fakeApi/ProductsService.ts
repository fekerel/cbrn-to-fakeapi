import addProduct from '@/api/body/fakeApi/addProduct.json'
import { categoryService } from './CategoryService';
import { getRandomValues, randomInt } from 'crypto';
import { userService } from './UserService';
import ConfigUtils from '@/common/ConfigUtils';
import merge from "lodash.merge";
import { AxiosResponse } from 'axios';
import ApiService from '../ApiService';


// {
//     "id": 23,
//         "sellerId": 7,
//             "categoryId": 3,
//                 "name": "Frozen Granite Bacon",
//                     "description": "The Brennon Sausages is the latest in a series of supportive products from Waelchi Inc",
//                         "price": 78.49,
//                             "stock": 93,
//                                 "variants": [
//                                     {
//                                         "id": "31e37114-4934-40b5-b2fa-7ff6148b135d",
//                                         "color": "pink",
//                                         "size": "L",
//                                         "price": "892.79",
//                                         "stock": 6
//                                     },
//                                     {
//                                         "id": "ac70b702-b8d8-4696-ad2a-42c6561a04ae",
//                                         "color": "magenta",
//                                         "size": "S",
//                                         "price": "850.79",
//                                         "stock": 80
//                                     },
//                                     {
//                                         "id": "851db61a-1491-4857-af55-2f4647d45fb6",
//                                         "color": "azure",
//                                         "size": "S",
//                                         "price": "684.20",
//                                         "stock": 14
//                                     }
//                                 ],
//                                     "tags": [
//                                         "sale",
//                                         "seasonal",
//                                         "new"
//                                     ],
//                                         "status": "inactive"
// },


class ProductService {

    public async createData() {
        const allCategoryList = await categoryService.getAllCategory();
        const allCategoryIdx = Array.from(new Set(allCategoryList.map((category) => category.id)))
        const categoryId = allCategoryIdx[randomInt(allCategoryIdx.length) - 1]
        const allUsers = await userService.getAllUsers();
        const allUsersIdx = Array.from(new Set(allUsers.map((user) => user.id)))

        const sellerId = allUsersIdx[randomInt(allUsersIdx.length) - 1]
        const name = ConfigUtils.generateUniqueWord();
        const description = ConfigUtils.generateUniqueWord3();
        const price = Math.random() * 100;
        const stock = Math.random() * 100;
        const variant = []
        for (let i = 0; i < 2; i++) {
            const data = {
                "id": ConfigUtils.generateUniqueWord3(),
                "color": ["pink", "grey", "black", "red", "orange", "yellow"][randomInt(6) - 1],
                "size": ["XS", "S", "M", "L", "XL", "XXL"][randomInt(6) - 1],
                "price": Math.random() * 100,
                "stock": Math.random() * 100,
            }
            variant.push(data)
        }
        const tags = []
        for (let i = 0; i < 2; i++) {
            tags.push(["featured", "bestseller", "popular", "limited", "exclusive", "premium", "recommended"][randomInt(7)])
        }
        const status = ["active", "inactive"][randomInt(2)]
        const addData = {
            "sellerId": sellerId,
            "categoryId": categoryId,
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "variants": variant,
            "tags": tags,
            "status": status

        }
        return addData;
    }

    public async createNewProduct() {
        let data = await this.createData();
        //data = JSON.parse(JSON.stringify(data));
        const addData = merge({}, addProduct, data);
        const response: AxiosResponse = await ApiService.getInstance().instance.post(`/products`, addData);
        return response.status;
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
        console.log("Starting Delete Product By ID");
        const product = await this.randomProduct();
        console.log("Product to be deleted ID:", product.id);
        const response: AxiosResponse = await ApiService.getInstance().instance.delete(`/products/${product.id}`);
        console.log("Delete Response Status:", response.status);
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