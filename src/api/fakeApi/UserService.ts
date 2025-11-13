import { DeepPartial } from "@/common/fakeApi/Types";
import ApiService from "../ApiService";
import { uniqueEmail, randomPassword } from "@/common/fakeApi/Utils";
import { AxiosResponse } from "axios";
import { merge } from "lodash";
import addUserJSON from "@api/body/fakeApi/addUser.json";

class UserService {


    public async addUser(userData: DeepPartial<typeof addUserJSON> = {}) {
        const overrides = userData;
        const body = merge({}, addUserJSON, overrides);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res;
    }
    public async addUserRandom(userData: DeepPartial<typeof addUserJSON> = {}) {
        const creds = { email: uniqueEmail("user"), password: randomPassword() };
        const body = merge({}, addUserJSON, creds, userData);
        const res = await ApiService.getInstance().instance.post("/users", body);
        return res.data;
    }

    public async getAllUsers() {
        const response: AxiosResponse = await ApiService.getInstance().instance.get(`/users`);
        return response;
    }

    public async getUserOnlyByID(id: number) {
        const response = await ApiService.getInstance().instance.get(`/users/${id}`);
        const isTrue = response.data.id === id;
        if (isTrue)
            return response;
        return false;
    }

    public async getRandomUser() {
        const users = (await this.getAllUsers()).data;
        const randomIndex = Math.floor(Math.random() * users.length);
        return users[randomIndex];
    }

    public async getUserByID() {
        const user = await this.getRandomUser();
        const response = await ApiService.getInstance().instance.get(`/users/${user.id}`);
        if (response.data.id !== user.id || response.status !== 200) {
            return false;
        }
        return response;
    }

    public async updateUser() {
        const user = await this.getRandomUser();
        const newFirstName = "UpdatedFN" + randomPassword(5);
        user.firstName = newFirstName;
        const response = await ApiService.getInstance().instance.put(`/users/${user.id}`, user);
        if (response.status !== 200)
            return false;
        const updatedUser = await this.getUserOnlyByID(user.id);
        if (typeof updatedUser !== "object") {
            return false;
        }
        if (updatedUser.data.id === user.id && updatedUser.data.firstName === user.firstName)
            return updatedUser;
        return false;
    }

    public async deleteUser() {
        const user = await this.getRandomUser();
        const response = await ApiService.getInstance().instance.delete(`/users/${user.id}`, user);
        if (response.status !== 200)
            return false;
        const deletedUserList = (await this.getAllUsers()).data;
        const isFalse = deletedUserList.some((userr) => userr.id === user.id);
        if (isFalse)
            return false;
        return response


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
        return response
    }
}

export const userService = new UserService();