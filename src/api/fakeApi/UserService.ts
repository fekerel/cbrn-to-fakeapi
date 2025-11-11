import ApiService from "../ApiService";

class UserService {
    // CRUD signatures only. Implementations intentionally removed for the experiment.

    public async createUser(body?: any) {
        // AI: Implement using ApiService.getInstance().instance.post("/users", body)
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getAllUsers() {
        // AI: Implement using ApiService.getInstance().instance.get("/users")
        throw new Error("NOT_IMPLEMENTED");
    }

    public async getUserById(id: number) {
        // AI: Implement using ApiService.getInstance().instance.get(`/users/${id}`)
        throw new Error("NOT_IMPLEMENTED");
    }

    public async updateUserById(id: number, body: any) {
        // AI: Implement using ApiService.getInstance().instance.put(`/users/${id}`, body)
        throw new Error("NOT_IMPLEMENTED");
    }

    public async deleteUserById(id: number) {
        // AI: Implement using ApiService.getInstance().instance.delete(`/users/${id}`)
        throw new Error("NOT_IMPLEMENTED");
    }
}

export const userService = new UserService();