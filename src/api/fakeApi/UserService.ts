import addUserJSON from "@api/body/fakeApi/addUser.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";
import { uniqueEmail, randomPassword, randomAmount } from "@/common/fakeApi/Utils";
import { orderService } from "./OrderService";
import { AxiosResponse } from "axios";

class UserService {
    /**
     * Create a user. `userData` will be deep-merged onto the default template.
     * Use a unique email in tests (timestamp/uuid).
     */
    public async addUser(userData: DeepPartial<typeof addUserJSON> = {}) {
        const overrides = userData;
        const body = merge({}, addUserJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res;
    }

    /**
     * Create user with auto-generated email/password (can still override).
     */
    public async addUserRandom(userData: DeepPartial<typeof addUserJSON> = {}) {

        const creds = { email: uniqueEmail("user"), password: randomPassword() };
        const body = merge({}, addUserJSON, creds, userData);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res.data;
    }

    /**
     * Get a single user by id.
     */
    public async getUser(id: number | string) {
        const res = await ApiService.getInstance().instance.get(`/users/${id}`);
        return res.data;
    }

    /**
     * List users with optional query params (status, address.city, etc.).
     */
    public async listUsers(params: Record<string, any> = {}) {
        const res = await ApiService.getInstance().instance.get("/users", { params });
        return res.data;
    }

    /**
     * Update (PUT) a user by id with provided patch (merged onto template optional).
     * If you want PATCH semantics, switch to instance.patch.
     */
    public async updateUser(id: number | string, patchData: DeepPartial<typeof addUserJSON>) {
        const getRes = await ApiService.getInstance().instance.get(`/users/${id}`);
        const existing = getRes && getRes.data ? getRes.data : {};
        const body = merge({}, existing, patchData);
        const res = await ApiService.getInstance().instance.put(`/users/${id}`, body);
        return res.data;
    }

    /**
    * Delete user by id.
    */
    public async deleteUser(id: number | string) {
        const res = await ApiService.getInstance().instance.delete(`/users/${id}`);
        return res.status === 200 || res.status === 204;
    }

    public async createUserThenOrderThenGetUserTotalSpent(): Promise<{
        requestedTotal: number;
        apiTotal: number;
    }> {
        const createdUserRes = await this.addUserRandom();
        const createdUser = createdUserRes && createdUserRes.data ? createdUserRes.data : createdUserRes;
        const userId = createdUser?.id;

        const requestedTotal = randomAmount();
        await orderService.addOrder({ userId, totalAmount: String(requestedTotal) });

        const res = await ApiService.getInstance().instance.get(`/users/${userId}/total-spent`);
        const payload = res && res.data ? res.data : {};

        let apiTotal = payload && (typeof payload.total === "number" ? payload.total : parseFloat(String(payload.total || 0)));
        apiTotal = isNaN(apiTotal) ? -1 : apiTotal;

        return { requestedTotal, apiTotal };
    }

    public async getAllUsers() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users`);
        return response.data;
    }
}

export const userService = new UserService();