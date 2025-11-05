import addUserJSON from "@api/body/fakeApi/addUser.json";
import ApiService from "../ApiService";
import { DeepPartial } from "../../common/fakeApi/Types";
import merge from "lodash.merge";
import { uniqueEmail, randomPassword, randomAmount } from "@/common/fakeApi/Utils";
import { orderService } from "./OrderService";
import { AxiosResponse } from "axios";
import { username } from "../_AwarenessMessageService";

class UserService {
    /**
     * Create a user. `userData` will be deep-merged onto the default template.
     * Use a unique email in tests (timestamp/uuid).
     */
    // public async addUser(userData: DeepPartial<typeof addUserJSON> = {}) {
    //     const overrides = userData;
    //     const body = merge({}, addUserJSON, overrides);
    //     const res = await ApiService.getInstance().instance.post("/users", body);
    //     return res;
    // }

    // /**
    //  * Create user with auto-generated email/password (can still override).
    //  */
    // public async addUserRandom(userData: DeepPartial<typeof addUserJSON> = {}) {

    //     const creds = { email: uniqueEmail("user"), password: randomPassword() };
    //     const body = merge({}, addUserJSON, creds, userData);
    //     const res = await ApiService.getInstance().instance.post("/users", body);
    //     return res.data;
    // }


    // public async createUserThenOrderThenGetUserTotalSpent(
    //     totalAmount: number | string
    // ): Promise<number> {
    //     const createdUserRes = await this.addUserRandom();
    //     const createdUser = createdUserRes && createdUserRes.data ? createdUserRes.data : createdUserRes;
    //     const userId = createdUser?.id;

    //     await orderService.addOrder({ userId, totalAmount: String(totalAmount) });

    //     const res = await ApiService.getInstance().instance.get(`/users/${userId}/total-spent`);
    //     const payload = res && res.data ? res.data : {};

    //     const totalSpent = payload && (typeof payload.total === "number" ? payload.total : parseFloat(String(payload.total || 0)));
    //     return isNaN(totalSpent) ? -1 : totalSpent;
    // }

    public async getAllUsers() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users`);
        return response.data;
    }

    public async getUserOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/users/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response.data;
        return false;
    }

    public getRandomUser() {
        return this.getAllUsers().then((users) => {
            const randomIndex = Math.floor(Math.random() * users.length);
            return users[randomIndex];
        });
    }

    public async getUserByID() {
        const user = await this.getRandomUser();
        const response = await ApiService.getInstance().instance.get(`/users/${user.id}`);
        if (response.data.id !== user.id || response.status !== 200) {
            return false;
        }
        return response.data;
    }

    public async updateUser() {
        const user = await this.getRandomUser();
        const newFirstName = "UpdatedFN" + randomPassword(5);
        user.firstName = newFirstName;
        const response = await ApiService.getInstance().instance.put(`/users/${user.id}`, user);
        if (response.status !== 200)
            return false;
        const updatedUser = await this.getUserOnlyByID(user.id);
        if (updatedUser.id === user.id && updatedUser.firstName === user.firstName)
            return response.data;
        return false;
    }

    public async deleteUser() {
        const user = await this.getRandomUser();
        const response = await ApiService.getInstance().instance.delete(`/users/${user.id}`, user);
        if (response.status !== 200)
            return false;
        const deletedUserList = await this.getAllUsers();
        const isFalse = deletedUserList.some((userr) => userr.id === user.id);
        if (isFalse)
            return false;
        return response.status


    }

    public async createNewUser() {
        const email = uniqueEmail("user");
        const password = randomPassword();
        const firstName = "TestFN" + randomPassword(5);
        const lastName = "TestLN" + randomPassword(5);
        const role = ["buyer", "seller", "admin", "superadmin", "support", "warehouse", "manager"][Math.floor(Math.random() * 7)];
        const address = {
            street: ["123 Test St", "456 Sample Ave", "789 Demo Blvd", "101112 Test Rd", "131415 Sample Ln"][Math.floor(Math.random() * 5)],
            city: ["TestCity", "SampleCity", "DemoCity", "ExampleCity", "MockCity"][Math.floor(Math.random() * 5)],
            country: ["TestCountry", "SampleCountry", "DemoCountry", "ExampleCountry", "MockCountry"][Math.floor(Math.random() * 5)],
            zipCode: ["12345", "67890", "11223", "44556", "77889"][Math.floor(Math.random() * 5)]
        }
        const phone = "+1" + Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const status = ["active", "inactive", "banned", "pending"][Math.floor(Math.random() * 4)];

        const body = {
            id: null,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            role: role,
            address: address,
            phone: phone,
            status: status
        };

        const response = await ApiService.getInstance().instance.post("/users", JSON.parse(JSON.stringify(body)));
        if (response.status !== 201) {
            throw new Error(`Failed to create user. Status code: ${response.status}`);
        }
        return response.data
    }
}

export const userService = new UserService();