import ApiService from "../ApiService";
import { AxiosResponse } from "axios";

class SellerService {
    public async getSellerCustomerRetention() {
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No sellers found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const response = await ApiService.getInstance().instance.get(`/sellers/${seller.id}/customer-retention`);
        return response;
    }

    public async getSellersRanking() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get("/sellers/ranking");
        return response;
    }

    public async getSellerProductPortfolio() {
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No sellers found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const response = await ApiService.getInstance().instance.get(`/sellers/${seller.id}/product-portfolio`);
        return response;
    }

    public async getSellerRevenueForecast() {
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No sellers found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const response = await ApiService.getInstance().instance.get(`/sellers/${seller.id}/revenue-forecast`);
        return response;
    }

    public async getSellerAnalytics() {
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No sellers found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const response = await ApiService.getInstance().instance.get(`/sellers/${seller.id}/analytics`);
        return response;
    }

    public async getSellerDashboard() {
        const usersResponse = await ApiService.getInstance().instance.get("/users?role=seller");
        const sellers = usersResponse.data;
        if (!sellers || sellers.length === 0) {
            throw new Error("No sellers found");
        }
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const response = await ApiService.getInstance().instance.get(`/sellers/${seller.id}/dashboard`);
        return response;
    }
}

export const sellerService = new SellerService();


