import addUserJSON from "@api/body/fakeApi/addUser.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";
import { uniqueEmail, randomPassword } from "@/common/fakeApi/Utils";
import { orderService } from "./OrderService";

class UserService {
    /**
     * Create a user. `userData` will be deep-merged onto the default template.
     * Use a unique email in tests (timestamp/uuid).
     */
    public async addUser(userData: DeepPartial<typeof addUserJSON> = {} ) {
        const overrides = userData;
        const body = merge({}, addUserJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res;
    }

    public async addUserRandom() {
        const randomCreds = { email: uniqueEmail("user"), password: randomPassword() };
        return await this.addUser(randomCreds);
    }

    public async createUserThenOrderThenGetUserTotalSpent(
        totalAmount: number | string
    ): Promise<number> {
        const createdUserRes = await this.addUserRandom();
        const createdUser = createdUserRes && createdUserRes.data ? createdUserRes.data : createdUserRes;
        const userId = createdUser?.id;

        await orderService.addOrder({ userId, totalAmount: String(totalAmount) });

        const res = await ApiService.getInstance().instance.get(`/users/${userId}/total-spent`);
        const payload = res && res.data ? res.data : {};

        const totalSpent = payload && (typeof payload.total === "number" ? payload.total : parseFloat(String(payload.total || 0)));
        return isNaN(totalSpent) ? -1 : totalSpent;
    }
}

export const userService = new UserService();