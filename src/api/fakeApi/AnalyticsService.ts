import ApiService from "../ApiService";
import { AxiosResponse } from "axios";

class AnalyticsService {
    public async getUserSellerAnalytics() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get("/analytics/user-seller");
        return response;
    }
}

export const analyticsService = new AnalyticsService();


