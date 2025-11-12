import ApiService from "../ApiService";
import { buildRandomUserBody } from "@common/fakeApi/Utils";

class UserService {
    private api = ApiService.getInstance().instance;

    // POST /users
    public async createUser(body?: any) {
        const payload = body ?? buildRandomUserBody();
        return this.api.post("/users", payload);
    }

    // GET /users
    public async getAllUsers() {
        return this.api.get("/users");
    }

    // GET /users/{id}
    public async getUserById(id: number) {
        return this.api.get(`/users/${id}`);
    }

    // PUT /users/{id}
    public async updateUserById(id: number, body: any) {
        const payload = body ?? buildRandomUserBody();
        return this.api.put(`/users/${id}`, payload);
    }

    // DELETE /users/{id}
    public async deleteUserById(id: number) {
        return this.api.delete(`/users/${id}`);
    }
}

export const userService = new UserService();